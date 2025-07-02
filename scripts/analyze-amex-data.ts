// Analyze the American Express input and output files to identify processing issues

async function analyzeAmexData() {
  console.log("=== ANALYZING AMERICAN EXPRESS DATA ===\n")

  try {
    // Fetch the input file
    console.log("Fetching input file...")
    const inputResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/activity-QY4bQye0M8zeJq1r97LKbVTIf0ZxKb.csv",
    )
    const inputText = await inputResponse.text()

    // Fetch the output file
    console.log("Fetching output file...")
    const outputResponse = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/converted_amex_2025-06-30-3TKhXyR7Wk6ywdJ8qs9BVyD7DWTqnF.csv",
    )
    const outputText = await outputResponse.text()

    // Parse input CSV
    const inputLines = inputText.split("\n").filter((line) => line.trim() !== "")
    const outputLines = outputText.split("\n").filter((line) => line.trim() !== "")

    console.log(`Input file: ${inputLines.length} lines`)
    console.log(`Output file: ${outputLines.length} lines`)

    // Analyze input structure
    console.log("\n=== INPUT FILE ANALYSIS ===")
    console.log("First 5 lines of input:")
    inputLines.slice(0, 5).forEach((line, i) => {
      const columns = line.split(",")
      console.log(`Line ${i + 1}: ${columns.length} columns`)
      console.log(`  Content: ${line.substring(0, 100)}...`)
    })

    // Check for header
    const headerLine = inputLines[0]
    const headerColumns = headerLine.split(",")
    console.log(`\nHeader columns (${headerColumns.length}):`)
    headerColumns.forEach((col, i) => {
      console.log(`  ${i}: "${col.trim()}"`)
    })

    // Analyze data rows
    console.log("\n=== DATA ROWS ANALYSIS ===")
    const dataRows = inputLines.slice(1) // Skip header
    console.log(`Total data rows: ${dataRows.length}`)

    // Sample data analysis
    console.log("\nFirst 10 data rows analysis:")
    dataRows.slice(0, 10).forEach((line, i) => {
      const columns = line.split(",")
      console.log(`Row ${i + 2}: ${columns.length} columns`)
      console.log(`  Date (col 0): "${columns[0]?.trim()}"`)
      console.log(`  Description (col 1): "${columns[1]?.trim()}"`)
      console.log(`  Amount (col 4): "${columns[4]?.trim()}"`)
      console.log(`  Statement desc (col 6): "${columns[6]?.trim()}"`)
      console.log("---")
    })

    // Check for empty or problematic rows
    let emptyRows = 0
    let shortRows = 0
    let validRows = 0

    dataRows.forEach((line, i) => {
      const columns = line.split(",")
      if (line.trim() === "") {
        emptyRows++
      } else if (columns.length < 5) {
        shortRows++
        console.log(`Short row ${i + 2}: ${columns.length} columns - "${line}"`)
      } else {
        validRows++
      }
    })

    console.log(`\n=== ROW QUALITY ANALYSIS ===`)
    console.log(`Empty rows: ${emptyRows}`)
    console.log(`Short rows (< 5 columns): ${shortRows}`)
    console.log(`Valid rows: ${validRows}`)
    console.log(`Expected processed: ${validRows}`)

    // Analyze date formats
    console.log("\n=== DATE FORMAT ANALYSIS ===")
    const dateFormats = new Map()
    dataRows.slice(0, 50).forEach((line, i) => {
      const columns = line.split(",")
      const dateStr = columns[0]?.trim()
      if (dateStr) {
        const format = analyzeDateFormat(dateStr)
        dateFormats.set(format, (dateFormats.get(format) || 0) + 1)
        if (i < 10) {
          console.log(`Row ${i + 2}: "${dateStr}" -> ${format}`)
        }
      }
    })

    console.log("\nDate format distribution:")
    dateFormats.forEach((count, format) => {
      console.log(`  ${format}: ${count} occurrences`)
    })

    // Analyze output file
    console.log("\n=== OUTPUT FILE ANALYSIS ===")
    console.log("First 5 lines of output:")
    outputLines.slice(0, 5).forEach((line, i) => {
      console.log(`Line ${i + 1}: ${line}`)
    })

    const outputDataRows = outputLines.slice(1) // Skip header
    console.log(`\nOutput data rows: ${outputDataRows.length}`)
    console.log(`Missing rows: ${dataRows.length - outputDataRows.length}`)
  } catch (error) {
    console.error("Error analyzing data:", error)
  }
}

function analyzeDateFormat(dateStr: string): string {
  if (!dateStr) return "empty"

  if (dateStr.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
    return "DD/MM/YYYY or MM/DD/YYYY"
  } else if (dateStr.match(/^\d{1,2}\.\d{1,2}\.\d{4}$/)) {
    return "DD.MM.YYYY"
  } else if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return "YYYY-MM-DD"
  } else {
    return `unknown: ${dateStr}`
  }
}

// Run the analysis
analyzeAmexData()
