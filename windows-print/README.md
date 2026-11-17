# Windows印刷編

[GAS教材の③](../gas/step03-pc-notification/README.md)で送る印刷開始の合図をPCで受け、Driveの画像を印刷へつなぐ編です。

次の作業で、ngrokの通知受信、PowerShellの実行、rcloneによる画像取得、プリンタ出力、印刷済みファイル管理を整備します。現在、このフォルダにはWindows印刷プログラムはありません。

GAS側のNGROK_URL・PC_USER・PC_PASSは、ここで準備する通知受信先とBasic認証の値に合わせます。PC側を整えて印刷を確認したあと、GASの④以降へ進みます。
