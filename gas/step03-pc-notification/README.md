# Step ③：PCへ印刷開始の合図を送る

## このStepで実現すること

②にPC通知を追加します。保存した画像を印刷へつなぐため、PCへ開始の合図を送ります。

## 関数の役割

| 関数 | 役割 |
| --- | --- |
| sendNotificationToPC() | 画像保存後に2秒待ち、ngrokを経由してPCの受信処理へ印刷開始の合図を送る関数です。 |

前のStepのdoPostとcreateResponseを含みます。

## 主要な処理の読み方

画像処理のtryブロックで、`saveImageToDrive(messageId)` の直後に `sendNotificationToPC()` を呼びます。保存関数が例外なく戻った画像ごとに、PC通知を試みる流れです。

通知関数は `Utilities.sleep(2000)` で2秒待ち、NGROK_URL・PC_USER・PC_PASSを読み込みます。Basic認証はユーザー名とパスワードで受信側へアクセスする方式です。`Utilities.base64Encode(USER + ':' + PASS)` で認証ヘッダー用の値を作ります。

`UrlFetchApp.fetch(NGROK_URL, options)` がHTTP POSTを送ります。画像ファイルをこのPOSTに添付するのではなく、PC側の受信処理へ開始の合図を送ります。応答本文は「PCからの応答（中身）」としてログに表示します。

## 必要な設定

②のLINE_ACCESS_TOKEN・FOLDER_IDを引き継ぎ、次の3項目を追加します。

| 設定名 | 内容 |
| --- | --- |
| NGROK_URL | ngrokを経由してPCの通知受信処理へ届くURLです。 |
| PC_USER | PC受信側のBasic認証ユーザー名です。 |
| PC_PASS | PC受信側のBasic認証パスワードです。 |

これらは[Windows印刷編](../../windows-print/README.md)で準備する受信側の値に合わせます。

## 登録と操作

1. [共通手順](../README.md#アカウントと準備)でGoogle・LINEとGASプロジェクトを準備します。
2. [Code.gs](Code.gs)の全文をGASへ貼り付けます。前のStepを使っていた場合はコード全体を置き換えます。
3. 上記の設定値を「プロジェクトの設定」→「スクリプト プロパティ」に登録します。①では登録不要です。
4. doPostをエディタから実行し、権限の認可画面が出たら確認して許可します。
5. 初回は「デプロイ」→「新しいデプロイ」→「ウェブアプリ」、実行ユーザー「自分」、アクセス「全員」で登録します。更新時は「デプロイを管理」→編集→「新バージョン」で反映します。
6. LINE DevelopersのWebhook URLへ /exec のURLを登録し、Webhook利用を有効にします。同じデプロイを更新した場合は登録済みURLを使います。詳しくは[共通手順](../README.md#初回デプロイ)を参照します。

## 動作確認

1. Windows印刷編でPCの通知受信先を準備し、3項目の設定を登録します。
2. LINEへテスト画像を1枚送り、Driveの保存ファイルを確認します。
3. GASで同期待ち、通知送信中、PCからの応答の各ログを確認します。
4. PC受信側の記録で合図の到着を確認します。複数の画像では画像ごとに通知を試みます。

PC側の受信・画像取得・印刷の構築はWindows印刷編で扱います。③のGASコードを登録したら、その編へ進んで両側をつなぎます。

## エラー時の確認箇所

設定不足のログではNGROK_URL・PC_USER・PC_PASSを確認します。PCへの通信例外ではngrokのURLと受信側の起動状態を確認します。応答本文に認証エラーがあれば、PC受信側とユーザー名・パスワードが一致しているか確認します。

## 次へ

[Windows印刷編](../../windows-print/README.md)へ進みます。
