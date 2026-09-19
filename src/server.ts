import express from "express";
import { checkDatabaseConnection, pool, getExpenses } from "./db.js";

const app = express();
app.use(express.json());
const port = 3000;

app.get("/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
  });
});

app.get("/expenses", async (_request, response) => {
  const expenses = await getExpenses();

  return response.status(200).json(expenses);
});

app.post("/expenses", async (request, response) => {
  const {
    requesterId,
    title,
    amount,
    expenseDate,
    expenseTime,
    category,
    memo,
  } = request.body;

  // requesterId
  if (
    typeof requesterId !== "number" ||
    !Number.isInteger(requesterId) ||
    requesterId < 1
  ) {
    return response.status(400).json({
      message: "requesterId는 1 이상의 정수여야 합니다.",
    });
  }

  // title
  if (
    typeof title !== "string" ||
    title.trim().length < 2 ||
    title.trim().length > 20
  ) {
    return response.status(400).json({
      message: "title은 2자 이상 20자 이하의 문자열이어야 합니다.",
    });
  }

  // amount
  if (
    typeof amount !== "number" ||
    !Number.isInteger(amount) ||
    amount < 1
  ) {
    return response.status(400).json({
      message: "amount는 1 이상의 정수여야 합니다.",
    });
  }

  // category
  if (
    typeof category !== "string" ||
    !["MEAL", "TRANSPORT", "SUPPLIES", "OTHER"].includes(category)
  ) {
    return response.status(400).json({
      message: "category가 올바르지 않습니다.",
    });
  }

  // memo
  if (
    memo !== undefined &&
    (
      typeof memo !== "string" ||
      memo.trim().length > 100
    )
  ) {
    return response.status(400).json({
      message: "memo는 100자 이하의 문자열이어야 합니다.",
    });
  }

  const normalizedMemo =
    memo === undefined || memo.trim().length < 1
      ? null
      : memo.trim();

  // expenseDate 형식
  const expenseDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  if (
    typeof expenseDate !== "string" ||
    !expenseDatePattern.test(expenseDate)
  ) {
    return response.status(400).json({
      message: "expenseDate는 YYYY-MM-DD 형식이어야 합니다.",
    });
  }

  // expenseDate 실제 날짜인지 확인
  const [year, month, day] = expenseDate
  .split("-")
  .map(Number) as [number, number, number];

  const parsedDate = new Date(
    Date.UTC(year, month - 1, day)
  );

  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() + 1 !== month ||
    parsedDate.getUTCDate() !== day
  ) {
    return response.status(400).json({
      message: "expenseDate는 실제 존재하는 날짜여야 합니다.",
    });
  }

  // expenseTime 형식
  const expenseTimePattern = /^\d{2}:\d{2}$/;

  if (
    typeof expenseTime !== "string" ||
    !expenseTimePattern.test(expenseTime)
  ) {
    return response.status(400).json({
      message: "expenseTime은 HH:mm 형식이어야 합니다.",
    });
  }

  // expenseTime 실제 시간인지 확인
  const [hour, minute] = expenseTime.split(":").map(Number) as [number, number];

  if (
    hour > 23 ||
    minute > 59
  ) {
    return response.status(400).json({
      message: "expenseTime은 실제 존재하는 시간이어야 합니다.",
    });
  }

  // 한국 시간 기준 실제 결제 시각 생성
  const expenseAt = new Date(
    `${expenseDate}T${expenseTime}:00+09:00`
  );

  // 미래 경비 방지
  if (expenseAt.getTime() > Date.now()) {
    return response.status(400).json({
      message: "expenseDate와 expenseTime은 미래일 수 없습니다.",
    });
  }

  // 한국 기준 현재 연/월
  const koreaDateParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());

  const currentYear = Number(
    koreaDateParts.find((part) => part.type === "year")?.value
  );

  const currentMonth = Number(
    koreaDateParts.find((part) => part.type === "month")?.value
  );

  // 이번 달 경비만 허용
  if (
    currentYear !== year ||
    currentMonth !== month
  ) {
    return response.status(400).json({
      message: "이번 달 경비만 등록할 수 있습니다.",
    });
  }

  // DB 저장
  const result = await pool.query(
    `
      INSERT INTO expenses (
        requester_id,
        title,
        amount,
        expense_at,
        category,
        memo
      )
      VALUES (
        $1, $2, $3, $4, $5, $6
      )
      RETURNING *
    `,
    [
      requesterId,
      title.trim(),
      amount,
      expenseAt,
      category,
      normalizedMemo,
    ]
  );

  return response.status(201).json({
    expense: result.rows[0],
  });
});

async function startServer(): Promise<void> {
  try {
    await checkDatabaseConnection();
    console.log("Database connection succeeded.");

    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  } catch (error) {
    console.error("Database connection failed.", error);
    process.exit(1);
  }
}

void startServer();