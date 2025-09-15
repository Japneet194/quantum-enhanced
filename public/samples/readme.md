# QEADS Sample CSVs

These sample files are provided to demo the CSV import feature. You can upload any of them from the dashboard widget.

Expected columns (case-insensitive when parsed):
- date: An ISO-like date (YYYY-MM-DD) or any parseable date.
- merchant: Merchant or description.
- amount: Positive amount for an expense; commas allowed.
- currency: Optional. Defaults to INR.

Notes
- The system stores expenses as negative amounts internally. Positive values in CSV are converted to negative during import.
- Categories are inferred heuristically (e.g., food, shopping, fuel, utilities, entertainment, other).
- Anomalies are flagged against your 30-day average per category.

Files
- `month-expenses-basic.csv` — 20 mixed transactions with normal spending.
- `month-expenses-with-anomalies.csv` — Includes a few unusually high purchases to trigger anomalies.
- `month-expenses-multi-currency.csv` — A few USD/EUR entries alongside INR.

Upload tips
- Keep file size under 10MB.
- Use UTF-8 encoding for best results.
- You can edit these files or create your own with the same columns.
