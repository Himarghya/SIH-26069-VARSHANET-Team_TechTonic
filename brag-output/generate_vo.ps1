Add-Type -AssemblyName System.Speech
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speaker.Rate = 3
$speaker.SetOutputToWaveFile("C:\Users\himar\.gemini\antigravity\scratch\varshanet\brag-output\composition\assets\voiceover.wav")
$text = "VARSHANET: National Meteorological Intelligence. Streaming thirty-three Doppler radars, CWC river gauges, and geotagged citizen reports via Apache Kafka. Dual-Engine AI combines VisionGuard against recycled fakes and TextGuard for seven-hazard Indic threat scoring. Explainable VayuScore cross-references radar physics to eliminate social noise. Featuring Citizen PWAs with privacy blur and Admin Command Grids with one-click CAP sirens and flood-safe rescue routing. Real-time resilience at national scale."
$speaker.Speak($text)
$speaker.Dispose()
& "C:\Users\himar\.cache\ffmpeg\bin\ffprobe.exe" -i "C:\Users\himar\.gemini\antigravity\scratch\varshanet\brag-output\composition\assets\voiceover.wav" -show_entries format=duration -v quiet -of csv="p=0"
