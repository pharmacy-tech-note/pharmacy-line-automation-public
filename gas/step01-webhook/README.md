# Step ①：LINEからの通知を受信する

## このStepで実現すること

LINEからの通知を受け取り、GASが応答を返す仕組みを作ります。

最初の目標は、LINEとGASがつながっていることを確認することです。

## 関数の役割

| 関数 | 役割 |
| --- | --- |
| `doPost(e)` | LINEから通知を受け取ったときに実行される関数です。通知の本文から `events` を取り出します。 |
| `createResponse(msg)` | LINEサーバーへ返すHTTP応答を作る関数です。 |

## 主要な処理の読み方

`e.postData.contents` には、LINEから届いた通知の本文が入っています。

`JSON.parse()` は、届いたJSON形式のデータをJavaScriptで扱える形に変換します。

`json.events` には、LINEで発生した出来事の一覧が入っています。

本文がない場合や、イベントが存在しない場合には、そのまま応答を返します。

`createResponse(msg)` は、`HtmlService.createHtmlOutput("OK")` を使用して応答を返します。

Step ①では、画像保存や自動返信はまだ行いません。まずは通知を受け取るところまでを確認します。

## 必要な設定

Step ①では、LINEのアクセストークンやスクリプトプロパティの設定は不要です。

## 登録と操作

1. Google DriveからGoogle Apps Scriptのプロジェクトを作成します。
2. [Code.gs](Code.gs)を開き、コード全文をコピーします。
3. GASの `コード.gs` に貼り付け、保存します。
4. 画面右上の「デプロイ」から「新しいデプロイ」を選択します。
5. 種類に「ウェブアプリ」を選び、以下のように設定します。

   - 説明：`step1`
   - 次のユーザーとして実行：自分
   - アクセスできるユーザー：全員

6. 「デプロイ」を押し、発行されたウェブアプリURLをコピーします。
7. LINE公式アカウントのWebhook URLに貼り付けて保存します。
8. LINE DevelopersのMessaging API設定でWebhook URLを確認します。

## 動作確認

1. LINE DevelopersでWebhook URLの「検証」を押します。
2. 検証結果を確認します。
3. GASの「実行数」を開き、`doPost` が実行されたことを確認します。
