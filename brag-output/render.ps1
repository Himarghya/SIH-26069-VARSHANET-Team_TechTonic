$env:PATH = "C:\Users\himar\.cache\ffmpeg\bin;" + $env:PATH
Set-Location "C:\Users\himar\.gemini\antigravity\scratch\varshanet\brag-output\composition"
npx hyperframes render --low-memory-mode --output ../brag.mp4
