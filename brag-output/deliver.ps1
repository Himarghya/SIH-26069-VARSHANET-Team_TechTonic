$ffmpeg = "C:\Users\himar\.cache\ffmpeg\bin\ffmpeg.exe"
Set-Location "C:\Users\himar\.gemini\antigravity\scratch\varshanet\brag-output"

# 1. Extract best settled frame (15.0s for Dual-Engine AI & VayuScore Ground Truth HUD)
& $ffmpeg -y -ss 15.0 -i brag.mp4 -frames:v 1 -q:v 2 brag.jpg

# 2. Bake poster as frame 0
& $ffmpeg -y -i brag.mp4 -i brag.jpg -filter_complex "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v]" -map "[v]" -map 0:a? -c:v libx264 -crf 18 -preset fast -pix_fmt yuv420p -c:a copy -movflags +faststart brag.poster.mp4

if (Test-Path "brag.poster.mp4") {
    Move-Item -Path "brag.poster.mp4" -Destination "brag.mp4" -Force
    Write-Output "Poster baked into frame 0."
}

# 3. Write share-copy.txt
@"
Meet VARSHANET: The 60-second deep dive into India's National Meteorological Intelligence Grid. Uniting 33 IMD Doppler radars, CWC river gauges, Dual-Engine AI (VisionGuard + TextGuard), explainable VayuScore™ ground-truth verification, OASIS CAP 1.2 sirens, and automated NDRF tactical disaster response protecting 1.4 billion citizens.
"@ | Out-File -FilePath "share-copy.txt" -Encoding utf8

Write-Output "Final delivery complete."
