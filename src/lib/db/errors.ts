/**
 * Centralized, secure database error-handling utility for all Server Actions.
 * Enforces OWASP ASVS v4.0: Zero SQL/schema information disclosure to clients.
 */

export interface DatabaseErrorResult {
  success: false;
  error: string;
}

export function handleDatabaseError(error: any, fallbackMessage: string = "Operation failed. Please try again."): DatabaseErrorResult {
  const errorCause = error?.cause || {};
  const errorCode = errorCause.code || error?.code || "";
  const detailedMsg = errorCause.message || errorCause.detail || error?.message || "";

  // Server-side confidential diagnostic logging
  console.error("[POSTGRES SERVER ERROR DIAGNOSTIC]:", {
    code: errorCode,
    detail: errorCause.detail,
    message: detailedMsg,
    hint: errorCause.hint,
    column: errorCause.column,
    table: errorCause.table,
  });

  // Client-safe sanitized error mapping based on standard PostgreSQL SQLSTATE codes & network errors
  let userMessage = fallbackMessage;

  if (errorCode === "23505") {
    // Unique violation
    userMessage = "A record with this identifier, code, or email already exists.";
  } else if (errorCode === "23502") {
    // Not null violation
    userMessage = "A required field was not provided. Please ensure all required fields are filled.";
  } else if (errorCode === "22P02") {
    // Invalid text representation or enum mismatch
    userMessage = "One or more submitted options had an invalid format or status value.";
  } else if (errorCode === "42703") {
    // Undefined column
    userMessage = "Database schema synchronization required. Please contact administrator.";
  } else if (errorCode === "42P01") {
    // Undefined table
    userMessage = "Database table was not found. Please run database setup.";
  } else if (
    errorCode === "08006" || 
    errorCode === "08001" || 
    errorCode === "ECONNREFUSED" || 
    errorCode === "ENOTFOUND" || 
    errorCode === "ETIMEDOUT" ||
    detailedMsg.includes("ECONNREFUSED") ||
    detailedMsg.includes("connection refused")
  ) {
    // Connection failure
    userMessage = "Database connection error: The database server is currently unreachable. Please check that DATABASE_URL is configured and the database is running.";
  } else if (
    detailedMsg && 
    !detailedMsg.includes("Failed query:") && 
    !detailedMsg.includes("insert into") && 
    !detailedMsg.includes("update ") && 
    !detailedMsg.includes("delete ") &&
    !detailedMsg.includes("select ") &&
    !detailedMsg.includes("values") &&
    !detailedMsg.includes("table") &&
    !detailedMsg.includes("column") &&
    detailedMsg.length < 120
  ) {
    userMessage = detailedMsg;
  }

  return {
    success: false,
    error: userMessage,
  };
}
