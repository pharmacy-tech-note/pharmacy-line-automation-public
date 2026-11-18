# Step ②：受信した画像をGoogle Driveへ保存する

## このStepで実現すること

Step ①では、LINEからの通知をGASで受け取るところまで作成しました。

今回は、LINEから送られた画像を取得し、Google Driveの指定フォルダに保存する機能を追加します。

これで、LINEに写真を送ると、Google Driveに画像ファイルが作成されるようになります。

## 関数の役割

| 関数 | 役割 |
| --- | --- |
| `doPost(e)` | LINEから通知を受け取り、画像メッセージかどうかを確認します。 |
| `saveImageToDrive(messageId)` | LINEから画像データを取得し、Google Driveに保存します。 |
| `createResponse(msg)` | LINEサーバーへHTTP応答を返します。 |

## 主要な処理の読み方

### ① LINEから届いたメッセージを確認する

`doPost(e)` は、Step ①から引き継いだ関数です。

LINEから通知が届くと、受信データの中に画像メッセージがあるか調べます。

```javascript
for (const event of events)
```

この処理は、LINEから届いたイベントを順番に調べるためのものです。

画像メッセージが見つかると、画像を識別する `messageId` を取得し、保存処理へ進みます。

### ② LINEから画像を取得する

`saveImageToDrive(messageId)` が、今回追加した中心となる関数です。

LINEから届くWebhookには、画像そのものではなく、画像を識別するための情報が含まれています。

そのため、GASからLINEのContent APIにアクセスして、画像データを取得します。

ここで使用するのが `LINE_ACCESS_TOKEN` です。

アクセストークンは、GASがLINEのAPIを利用する際の認証情報になります。

### ③ Google Driveへ保存する

取得した画像は `response.getBlob()` でファイルとして扱えるデータにします。

続いて、`DriveApp.getFolderById(FOLDER_ID)` で保存先のフォルダを指定します。

最後に `folder.createFile(imageBlob)` で画像ファイルを作成します。

ファイル名は次の形式です。

`rx_年月日_時分秒_メッセージID.jpg`

送られた画像を区別できるよう、日時とメッセージIDを付けています。

## 必要な設定

Step ②では、GASに次の2つの設定を追加します。

| 設定名 | 内容 |
| --- | --- |
| `LINE_ACCESS_TOKEN` | LINE Messaging APIのチャネルアクセストークン |
| `FOLDER_ID` | Google Driveの画像保存先フォルダID |

### LINE_ACCESS_TOKENの取得

1. LINE Developersにログインします。
2. 対象のプロバイダーとMessaging APIチャネルを開きます。
3. Messaging API設定でチャネルアクセストークンを確認します。
4. 必要に応じて発行し、コピーします。

### FOLDER_IDの取得

Google Driveで、画像を保存するフォルダを開きます。

ブラウザのアドレス欄には、次のようなURLが表示されます。

`https://drive.google.com/drive/folders/フォルダID`

`folders/` より後ろの文字列がフォルダIDです。

これをコピーします。

### GASへの設定

1. GASの画面を開きます。
2. 左側の歯車マーク「プロジェクトの設定」を選択します。
3. 「スクリプト プロパティ」から設定を追加します。
4. `LINE_ACCESS_TOKEN` にアクセストークンを登録します。
5. `FOLDER_ID` に保存先のフォルダIDを登録します。
6. 設定を保存します。

設定名は大文字・小文字も含めて、コードと一致させてください。

## コードの登録

1. [Step ②のCode.gs](Code.gs)を開きます。
2. コード全文をコピーします。
3. GASの `コード.gs` に貼り付け、Step ①のコード全体を置き換えます。
4. 保存ボタンを押します。

Step ②のコードには、Step ①の機能も含まれています。

## デプロイの更新

Step ①で作成したWebアプリを更新します。

1. GAS画面の「デプロイ」から「デプロイを管理」を選択します。
2. 使用中のWebアプリを選択します。
3. 編集アイコンを押します。
4. バージョンで「新バージョン」を選択します。
5. 「デプロイ」を押します。

同じデプロイを更新した場合、Webhook URLを新しく登録し直す必要はありません。

画像保存に必要なGoogle Driveなどのアクセス権限が求められた場合は、内容を確認して承認します。

## 動作確認

1. LINEのWebhookを有効にします。
2. LINE公式アカウントへテスト用の画像を1枚送信します。
3. GASの「実行数」で `doPost` の実行履歴を確認します。
4. Google Driveの指定フォルダを開きます。
5. `rx_` から始まる画像ファイルが作成されていることを確認します。
6. 保存された画像を開き、送った画像と一致していることを確認します。

画像が正常に保存されていれば、Step ②は完成です。

## うまく動かない場合

画像が保存されない場合は、次の項目を確認します。

- `LINE_ACCESS_TOKEN` が正しく登録されているか。
- `FOLDER_ID` が正しい保存先フォルダを指しているか。
- GASを実行するGoogleアカウントにフォルダへの保存権限があるか。
- コードを変更した後、新しいバージョンでデプロイしたか。
- GASの実行履歴にエラーが表示されていないか。

## 次のStep

LINEから画像を受け取り、Google Driveへ保存できるようになりました。

次は、画像を保存したことをPCへ知らせる仕組みを追加します。

[Step ③：PCへ印刷開始の合図を送る](../step03-pc-notification/README.md)