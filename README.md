# React + Vite + TypeScript Bootstrap

React 19とVite 6を使用したモダンなフロントエンド開発プロジェクトのテンプレートです。

## 要件

- Node.js v24

## セットアップ

```bash
npm install
```

## 開発

```bash
npm run dev
```

デフォルトで `http://localhost:3000` で起動します。

## ビルド

```bash
npm run build
```

`dist/` ディレクトリに本番用アセットが出力されます。

## 型チェック

```bash
npm run typecheck
```

TypeScript の型チェックを実行します。

## リント

```bash
npm run lint
```

コードをチェックします。

```bash
npm run lint:fix
```

コードを自動フォーマット・修正します。

## テスト

```bash
npm run test
```

テストを実行します。

```bash
npm run test:coverage
```

カバレッジレポート付きでテストを実行します。

## 機能

- **React 19**: 最新の React フレームワーク
- **Vite 6**: 高速なビルドツール
- **TypeScript**: 厳密型チェック設定
- **Biome**: リント・フォーマッター
- **Vitest**: ユニットテストフレームワーク
- **React Testing Library**: コンポーネントテストライブラリ

## TypeScript 設定

このプロジェクトは以下の厳密な TypeScript 設定を使用しています：

- `strict`: true
- `noUncheckedIndexedAccess`: true
- `exactOptionalPropertyTypes`: true
- `noImplicitReturns`: true
- `noPropertyAccessFromIndexSignature`: true
