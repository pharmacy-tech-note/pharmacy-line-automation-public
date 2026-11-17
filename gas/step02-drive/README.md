# Step ②：受信した画像をGoogle Driveへ保存する

## このStepで実現すること

①に画像保存を追加します。LINEで届いた受付画像をDriveの指定フォルダへ保管できるようにします。

## 関数の役割

| 関数 | 役割 |
| --- | --- |
| saveImageToDrive(messageId) | LINEから画像データを取得し、Google Driveの指定フォルダに保存する関数です。受付画像をファイルとして保管します。 |

前のStepのdoPostとcreateResponseを含みます。

## 主要な処理の読み方

`PropertiesService.getScriptProperties()` で設定を読み、LINE_ACCESS_TOKENとFOLDER_IDを使います。`for (const event of events)` で届いた出来事を順に調べ、画像メッセージの場合にmessageIdを取り出します。

`saveImageToDrive(messageId)` はLINE Content API（送信された画像を取得する窓口）へアクセスします。`Authorization: Bearer ...` にアクセストークンを付け、`response.getBlob()` でファイルとして扱うデータを取り出します。

`Utilities.formatDate()` とmessageIdで `rx_yyyyMMdd_HHmmss_メッセージID.jpg` という名前を付けます。`DriveApp.getFolderById(FOLDER_ID)` が保存先を選び、`folder.createFile(imageBlob)` がファイルを作ります。処理中の例外は既存のtry/catchで受け、内部処理エラーのログに記録します。

## 必要な設定

| 設定名 | 内容 |
| --- | --- |
| LINE_ACCESS_TOKEN | 対象LINEチャネルのアクセストークン。画像取得時の認証に使います。 |
| FOLDER_ID | Google Driveの画像保存先フォルダのIDです。 |

## 登録と操作

1. [共通手順](../README.md#アカウントと準備)でGoogle・LINEとGASプロジェクトを準備します。
2. [Code.gs](Code.gs)の全文をGASへ貼り付けます。前のStepを使っていた場合はコード全体を置き換えます。
3. 上記の設定値を「プロジェクトの設定」→「スクリプト プロパティ」に登録します。①では登録不要です。
4. doPostをエディタから実行し、権限の認可画面が出たら確認して許可します。
5. 初回は「デプロイ」→「新しいデプロイ」→「ウェブアプリ」、実行ユーザー「自分」、アクセス「全員」で登録します。更新時は「デプロイを管理」→編集→「新バージョン」で反映します。
6. LINE DevelopersのWebhook URLへ /exec のURLを登録し、Webhook利用を有効にします。同じデプロイを更新した場合は登録済みURLを使います。詳しくは[共通手順](../README.md#初回デプロイ)を参照します。

## 動作確認

1. 「テスト」と書いた画像をLINEへ1枚送ります。
2. GASで「正常に処理完了: メッセージID …」を確認します。
3. 指定Driveフォルダにrx_で始まるファイルが作られ、画像を開けることを確認します。
4. テキストやスタンプを送り、画像保存処理が実行されないことを確認します。

## エラー時の確認箇所

設定不足の警告ではLINE_ACCESS_TOKENとFOLDER_IDを確認します。「内部処理エラー」ではログに表示された例外を読み、DriveのフォルダID、保存権限、空き容量や通信状態を確認します。

## 次へ

[③ PCへの通知](../step03-pc-notification/README.md)へ進みます。
