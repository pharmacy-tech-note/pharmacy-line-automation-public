
# LINE画像 自動印刷 + 印刷済み画像の自動削除

# --- 設定 ---
$folderPath  = "G:\マイドライブ\LINE_in"
$printerRx   = "プリンター名"
$sumatraPath = "C:\Tools\SumatraPDF.exe"

# 印刷済みファイルの保持時間（分）
$cleanupMinutes = 5

# --- 印刷開始 ---
Write-Host "LINE画像の監視を開始しました"
Write-Host "監視フォルダ: $folderPath"
Write-Host "プリンター: $printerRx"
Write-Host "印刷済みファイルは5分経過後に削除します"

while ($true) {
    try {
        if (Test-Path $folderPath) {

            # --- 未印刷の画像を探す ---
            $unprintedFiles = Get-ChildItem -Path $folderPath -File |
                Where-Object {
                    $_.Name -notmatch "^printed_" -and
                    $_.Extension -match "\.(jpg|jpeg|png)$"
                }

            foreach ($file in $unprintedFiles) {

                # 0バイトのファイルは印刷しない
                if ($file.Length -eq 0) {
                    continue
                }

                try {
                    Write-Host "印刷開始: $($file.Name)"

                    # 画像を印刷
                    Start-Process -FilePath $sumatraPath `
                        -ArgumentList "-print-to `"$printerRx`" -silent `"$($file.FullName)`"" `
                        -WindowStyle Hidden -Wait -ErrorAction Stop

                    # 印刷処理後、名前を変更
                    Rename-Item -Path $file.FullName `
                        -NewName "printed_$($file.Name)" `
                        -ErrorAction Stop

                    Write-Host "印刷処理完了: $($file.Name)"

                } catch {
                    Write-Host "印刷エラー: $($_.Exception.Message)"
                }
            }

            # --- 5分経過した印刷済み画像を削除 ---
            $limitTime = (Get-Date).AddMinutes(-$cleanupMinutes)

            $printedFiles = Get-ChildItem -Path $folderPath -File |
                Where-Object {
                    $_.Name -match "^printed_" -and
                    $_.Extension -match "\.(jpg|jpeg|png)$"
                }

            foreach ($file in $printedFiles) {
                if ($file.LastWriteTime -lt $limitTime) {
                    try {
                        Remove-Item -Path $file.FullName `
                            -Force -ErrorAction Stop

                        Write-Host "印刷済み画像を削除: $($file.Name)"

                    } catch {
                        Write-Host "削除エラー: $($_.Exception.Message)"
                    }
                }
            }
        }

    } catch {
        Write-Host "監視エラー: $($_.Exception.Message)"
    }

    # 30秒後に再確認
    Start-Sleep -Seconds 30
}
