export type SqlDialect = "sql" | "mysql" | "postgresql" | "sqlite" | "tsql" | "plsql";
export type SqlKeywordCase = "upper" | "lower" | "preserve";

export interface SqlFormatOptions {
  dialect?: SqlDialect;
  tabWidth?: number;
  useTabs?: boolean;
  keywordCase?: SqlKeywordCase;
  minify?: boolean;
}

export const SQL_DIALECTS: { value: SqlDialect; label: string }[] = [
  { value: "sql", label: "SQL (Standard)" },
  { value: "mysql", label: "MySQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "tsql", label: "T-SQL (SQL Server)" },
  { value: "plsql", label: "PL/SQL (Oracle)" },
];

export async function formatSqlQuery(input: string, opts: SqlFormatOptions = {}): Promise<string> {
  if (!input.trim()) return "";
  const { dialect = "sql", tabWidth = 2, useTabs = false, keywordCase = "upper", minify = false } = opts;
  const { format } = await import("sql-formatter");
  try {
    if (minify) {
      const formatted = format(input, { language: dialect, tabWidth: 0, keywordCase });
      return formatted.replace(/\n\s*/g, " ").replace(/\s+/g, " ").trim();
    }
    return format(input, { language: dialect, tabWidth, useTabs, keywordCase });
  } catch {
    return input;
  }
}
