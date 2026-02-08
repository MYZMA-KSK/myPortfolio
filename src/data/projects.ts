export type ProjectCategory = 'web' | 'electronics';

export type ProcessPhase = '企画' | '制作' | '評価';

export interface ProcessStep {
  phase: ProcessPhase;
  title: string;
  description: string;
  images?: string[];
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  period: string;
  description: string;
  roles: string[];
  tools: string[];
  highlights: string[];
  images: string[];
  url?: string;
  awards?: string[];
  process?: ProcessStep[];
}

export const projects: Project[] = [
  // ウェブサービス開発 (2016-2022)
  {
    slug: 'fastest',
    title: 'FasTest',
    subtitle: 'ランディングページ高速化ツールのUIデザイン',
    category: 'web',
    period: '2022年〜',
    description: 'ランディングページの表示速度を改善するためのツール。デザイントークンの制定からデザインシステムの構築まで、理想的なプロセスでUIデザインを担当。',
    roles: [
      '情報設計',
      'UIデザインの作成',
      'プロトタイプの作成',
      'ヘルプマニュアルの作成',
      'ランディングページの作成',
    ],
    tools: ['Figma', 'Zeplin', 'Adobe XD', 'Adobe After Effects', 'Lottie'],
    highlights: [
      'デザイントークンの制定による共通言語の確立',
      'Figmaでのデザインライブラリ構築',
      'ZeplinとStorybookの連携によるハンドオフ改善',
      'Lottieによるモーショングラフィックの実装',
    ],
    images: [
      '/images/projects/fastest-ui-main.jpg',
      '/images/projects/img-002.jpg',
      '/images/projects/img-001.jpg',
      '/images/projects/img-004.jpg',
      '/images/projects/img-000.jpg',
    ],
    url: 'https://fastest.jp/',
    process: [
      { phase: '企画', title: 'ブランディングの開発', description: 'FasTestブランドの世界観を象徴するロゴタイプ・キービジュアルのデザインと、プロダクト全体のトーン&マナーを開発' },
      { phase: '企画', title: 'デザイントークンの制定', description: 'カラー、タイポグラフィ、シャドウ、スペーシングなどのデザイントークンをFigmaで制定し、エンジニアとの共通言語を確立', images: ['/images/projects/img-024.png'] },
      { phase: '制作', title: 'デザインライブラリの構築', description: 'FigmaでAtomicコンポーネントとスタイルガイドを構築。ZeplinとStorybookの連携でハンドオフを改善', images: ['/images/projects/fastest-design-system.jpg'] },
      { phase: '制作', title: '情報設計とワイヤーフレームの作成', description: 'セールス部門にヒアリングを実施して、実現したい要求と完了させたいタスクを整理。Whimsicalを使用してワイヤーフレームと画面遷移を作成', images: ['/images/projects/img-066.jpg'] },
      { phase: '制作', title: 'UIデザインの作成', description: 'デザインライブラリのコンポーネントを使用して、実際のイメージをモックアップレベルで作成。状況に応じた画面の変更パターンを作成', images: ['/images/projects/img-008.jpg'] },
      { phase: '制作', title: 'プロトタイプの作成', description: '主要なタスクの開始から完了までの操作の流れをイメージできるプロトタイプをSketch/Figmaで作成', images: ['/images/projects/img-067.jpg'] },
      { phase: '制作', title: 'ヘルプマニュアルの制作', description: '実装と並行して、PDFのヘルプマニュアルを制作。モックアップと変わらない実装が実現されることで操作に矛盾がないことを確認', images: ['/images/projects/img-065.png', '/images/projects/img-049.jpg', '/images/projects/img-053.jpg'] },
      { phase: '制作', title: 'ランディングページの制作', description: 'Adobe XDでプロモーション用のランディングページを制作。Adobe After EffectsとLottieの連携によるモーショングラフィックの書き出しにも対応', images: ['/images/projects/img-016.jpg', '/images/projects/img-020.jpg'] },
    ],
  },
  {
    slug: 'sitest',
    title: 'SiTest',
    subtitle: 'ウェブサイト解析・改善ツールのUIデザイン',
    category: 'web',
    period: '2019年〜',
    description: 'ウェブサイトの解析・改善を行うためのツール。企画会議の段階からアイデアと仕様の検討に参加し、継続的な機能追加とUI改善を担当。',
    roles: [
      '企画・リサーチ',
      '情報設計',
      'UIデザインの作成',
      'プロトタイプの作成',
      'ヘルプページの作成',
    ],
    tools: ['Sketch', 'Whimsical', 'Adobe After Effects', 'Bitbucket', 'Zendesk'],
    highlights: [
      'ユーザーストーリーマップによる要求仕様の視覚化',
      'OOUIを念頭に置いた画面設計',
      'Atomic Designに基づいたデザインライブラリの構築',
      '継続的なダッシュボード画面の改善',
    ],
    images: [
      '/images/projects/sitest-dashboard.jpg',
      '/images/projects/img-082.jpg',
      '/images/projects/img-077.jpg',
      '/images/projects/img-079.jpg',
      '/images/projects/img-076.jpg',
    ],
    url: 'https://sitest.jp/',
    process: [
      { phase: '企画', title: '企画会議', description: '定期的に開催されるセールスチームと開発チームの企画会議に参加。ユーザーの要望とゴールをできる限り明らかにし、アイデアや改善策を提案' },
      { phase: '企画', title: 'リサーチ・競合調査', description: 'セールスチームからの要望に応じて、同じドメインの競合のプロダクト・サービスの公式サイトや有料コンテンツをチェックして、自社プロダクトに不足している機能や提供価値を調査' },
      { phase: '制作', title: '情報設計', description: 'ユーザーストーリーマップのカードから「オブジェクト」と「プロパティ」を抽出。OOUIを念頭に置いて画面のレイアウトや遷移の様子を検討', images: ['/images/projects/sitest-wireframes.jpg'] },
      { phase: '制作', title: 'ワイヤーフレームの作成', description: '複雑な画面を作成する場合は、画面を共有しながらWhimsicalを使用して、関係者とリアルタイムでワイヤーフレームを作成しながら合意形成を図る' },
      { phase: '制作', title: 'UIデザインの作成', description: 'UIリニューアル時に作成したデザインライブラリのコンポーネントを最大限活用して、実際のイメージを伝えられる画面のレイアウトをSketchで作成', images: ['/images/projects/sitest-ui-components.jpg'] },
      { phase: '制作', title: 'プロトタイプの作成', description: '主要なタスクの開始から完了までの操作の流れをイメージできるプロトタイプをSketchで作成', images: ['/images/projects/img-123.jpg'] },
      { phase: '制作', title: '実装の確認', description: 'Bitbucketを介して開発チームが実装したい内容や画面を確認して、承認または修正を依頼。セルフレビューにより「リリースタイミング」と「品質優先」に重きを置いて確認' },
      { phase: '制作', title: 'ヘルプページの作成', description: 'UIデザイン検討時に想定していた画面の要素やタスクの流れと、テクニカルライティングの流れを説明用のスクリーンショットの撮影とともに実施して、説明文と一致させる' },
      { phase: '評価', title: '評価・効果検証', description: 'リソースや教育、リリースサイクルの問題から、今のところユーザビリティテストなどの評価を行えていないが、機能の利用数を計測して次回の企画や改善活動の優先付けに活用' },
    ],
  },
  {
    slug: 'sitest-help',
    title: 'SiTest ヘルプセンター',
    subtitle: 'ヘルプセンターのリニューアル',
    category: 'web',
    period: '2020年3月〜',
    description: '既存のヘルプページの網羅性・正確性の課題を解決するため、UIデザイナー自らが500ページ超のヘルプを作成。',
    roles: [
      'リサーチ',
      '情報設計',
      'テクニカルライティング',
      'デザイン',
    ],
    tools: ['Google スプレッドシート', 'Zendesk'],
    highlights: [
      '約150ページから約500ページへの細分化',
      'テクニカルライティングのルールに則ったライティング',
      'サポート工数の削減を実現',
      '社内教育ツールとしても活用',
    ],
    images: [
      '/images/projects/sitest-help-center.jpg',
      '/images/projects/img-086.jpg',
      '/images/projects/img-085.jpg',
      '/images/projects/img-088.jpg',
      '/images/projects/img-087.jpg',
    ],
    url: 'https://support.sitest.jp/hc/ja',
    process: [
      { phase: '企画', title: '気づき', description: 'UIをリニューアルしたにも関わらず、既存のヘルプページの網羅性・正確性が乏しく、「10ヒューリスティックス」の「10. ヘルプや説明文書を用意する」を満たせていなかった' },
      { phase: '企画', title: 'リサーチ', description: 'ライティングに着手する前に、カスタマーサポート担当者とセールス担当者に既にある内容を整理してもらい、「よくある質問」を洗い出させていただいた' },
      { phase: '制作', title: 'サイトの構成', description: 'サービスの「利用前→利用中→利用後」の流れをベースに、画面とタスクの説明に必要なカテゴリーリストを作成して、サイト全体の構成を検討。最終的に約500ページに細分化', images: ['/images/projects/img-115.png'] },
      { phase: '制作', title: 'ライティング', description: 'テクニカルライティングの知見を生かして、既存のルールブック+αをベースにしたテンプレートを作成。開発チームから詳細な仕様をヒアリングして、利用における「ヒント」や「注意」を明文化', images: ['/images/projects/img-116.png', '/images/projects/sitest-help-structure.png'] },
      { phase: '制作', title: '内容のチェックと文字校正', description: '誤り漏れ防止のため、カスタマーサポート・セールス・エンジニアの担当者と協力して、ページごとの確かめ合わせを行い、誤った説明や誤字・数字がないか多角的にチェック' },
      { phase: '制作', title: 'カスタマーサポートツールの導入', description: 'ヘルプセンターとして公開するためのカスタマーサポートツールの選定を実施。カスタマーサポート担当者の要望を洗い手順要と、ヘルプへのカスタマイズ性を考慮してZendeskの導入を推進' },
      { phase: '評価', title: '公開後の効果と展開', description: 'ヘルプページへのアクセスが増加してユーザーに活用されたことで、サポートの工数が削減。社内教育ツールとして活用されたことで、カスタマーサポート担当者が裏取りが容易になった' },
    ],
  },
  {
    slug: 'sitest-admin',
    title: 'SiTest Admin画面',
    subtitle: 'Admin画面のUIリニューアル',
    category: 'web',
    period: '2020年7月〜',
    description: 'セールスチームと開発チームの業務を観察し、作業負担の大きいAdmin画面のUIリニューアルを自ら主導。社内向けツールのため画面キャプチャは非公開。',
    roles: [
      'リサーチ',
      '情報設計',
      'UIデザインの作成',
      '簡易ユーザビリティテストの計画・実施',
    ],
    tools: ['Sketch'],
    highlights: [
      'インタビューとユーザーストーリーマップによる課題発見',
      'OOUIベースの画面構成設計',
      'プロトタイプを使用した簡易ユーザビリティテスト実施',
      '開発チームの作業負担削減を実現',
    ],
    images: [],
    process: [
      { phase: '企画', title: '気づき', description: 'セールスチームと開発チームの日々の業務のチャットのやり取りを観察して、「ユーザーの新規アカウント開設」と「プラン変更の手続き」に開発チームの作業の負担が大きいことに気づいた' },
      { phase: '企画', title: 'リサーチ', description: '「ユーザーの新規アカウント開設」と「プラン変更の手続き」のワークフローについて、セールスチームメンバーにインタビューを実施して、ユーザーストーリーマップを作成', images: ['/images/projects/img-119.jpg'] },
      { phase: '制作', title: '情報設計', description: 'ユーザーストーリーマップの内容から、「ユーザー」と「プラン」を主要なオブジェクトと定義。データベースの情報を開発チームに確認して、「ユーザー」と「プラン」のプロパティを整理' },
      { phase: '制作', title: 'UIデザインの作成', description: 'UIリニューアル時に作成したデザインライブラリのコンポーネントを最大限活用し、実際のイメージを伝えられる画面のレイアウトをSketchで作成' },
      { phase: '制作', title: 'プロトタイプの作成', description: '主要なタスクである「新規ユーザーのアカウント開設」と「プラン変更の手続き」のタスクを行う再現できるプロトタイプをSketchで作成' },
      { phase: '制作', title: '簡易ユーザビリティテストの実施', description: '私がモデレーターとなり、セールス担当2名とエンジニア2名を被験者として、プロトタイプを使用した簡易なユーザビリティテストを実施' },
      { phase: '評価', title: '運用の効果', description: 'ユーザー中心で設計したAdmin画面にリニューアルしたことで、開発チームの負担を削減できた。操作を覚えれば誰でも新規ユーザー登録とプランの変更ができるようになった' },
    ],
  },
  {
    slug: 'sitest-renewal',
    title: 'SiTest 管理画面',
    subtitle: '管理画面のUIリニューアル',
    category: 'web',
    period: '2019年3月',
    description: 'オールインワンの多機能アプリに対して、一貫性と明快な導線のある情報設計を追求したUIリニューアル。',
    roles: [
      '画面設計',
      '画面遷移設計',
      'リソース作成',
      'デザインガイドライン作成',
      '人間中心設計に基づいたUIデザインの推進',
    ],
    tools: ['Adobe XD', 'Sketch'],
    highlights: [
      'モードレスなUIの実現',
      'Atomic Designの本格採用',
      'アジャイルを意識した開発サイクルのリード',
      'デザインガイドラインによる一貫性の確保',
    ],
    images: [
      '/images/projects/sitest-dashboard.jpg',
      '/images/projects/img-126.jpg',
      '/images/projects/img-127.jpg',
      '/images/projects/sitest-dashboard-renewal.jpg',
    ],
    url: 'https://sitest.jp/',
    process: [
      { phase: '企画', title: 'スケジューリング', description: '社内で最も現行の製品を使用しているセールス側コンサルタントと、エンジニアのプロジェクトマネージャーと私の3人で打ち合わせ、開発に着手する優先順位を決定' },
      { phase: '企画', title: 'リサーチ：エキスパートレビュー', description: '事前にデザイナーの目線で現行の製品のエキスパートレビューを実施。ヒューリスティックな使いにくさ、流行り以外の余業の不整合などの課題を抽出' },
      { phase: '制作', title: 'プロジェクト推進の改革', description: '先の2名のキーマンとセールス側の要求と仕様の確認を行いながら大機能ごとに「ペーパープロトタイプの作成」→「Adobe XDでワイヤーレベルの動作するプロトタイプの作成」→「プロトタイプを使用してのレビュー」→「デザインの精緻化」というアジャイルを意識したプロセスを開始' },
      { phase: '制作', title: '情報設計', description: '「モードレスなUI」を実現するために、画面の構成をコレクション/シングルに整理。タスク支援のUIのうち分類して複数のオールインワンをセールスポイントにした多機能なアプリであっても、一貫性と明快な導線のある情報設計を追求' },
      { phase: '制作', title: 'デザインガイドラインの作成', description: 'Atomic Designの考え方を本格的に採用して、先行してコントロールのUIコンポーネントからデザインを精緻化してライブラリ化。プロトタイプで検証した画面を、ライブラリから引用したUIコンポーネントで精緻化して作業の効率化と一貫性のあるデザインを実現' },
      { phase: '制作', title: 'プロトタイピングの作成', description: 'メインタスクの動作を確認できるプロトタイプを作成することで、エンジニアは実装の作業ボリュームをイメージしやすくなり、精度の高い工数の見積もりが行うことができた', images: ['/images/projects/sitest-reports.jpg'] },
    ],
  },
  {
    slug: 'spaia',
    title: 'SPAIA',
    subtitle: 'スポーツメディアサイト',
    category: 'web',
    period: '2016年9月〜',
    description: '大量の情報を視覚化する際に「情報がユーザーに伝えたいことは何か？」を常に問いながらデザインに取り組んだスポーツメディアサイト。',
    roles: [
      '画面設計',
      '画面遷移設計',
      'リソース作成',
      'デザインガイドライン作成',
      'プロトタイプ作成',
    ],
    tools: ['Sketch', 'Zeplin', 'Prott', 'Frontify', 'TrackDuck'],
    highlights: [
      'ブランドロゴ・トーン&マナーの開発',
      'Sketch + Zeplinの導入推進',
      'レスポンシブではなくデバイスごとに最適化したUI',
      'KPT分析による継続的改善',
    ],
    images: [
      '/images/projects/spaia-ui-desktop.png',
      '/images/projects/spaia-ui-mobile.png',
    ],
    url: 'https://spaia.jp/',
    process: [
      { phase: '企画', title: 'ブランドロゴ・トーン&マナーの開発', description: 'スポーツメディアのブランディングとして、ロゴタイプとトーン&マナーを開発。スポーツの躍動感とデータの信頼性を表現', images: ['/images/projects/spaia-brand-logo.png', '/images/projects/spaia-tone-manner.png'] },
      { phase: '制作', title: '画面設計', description: '大量の情報を視覚化する際に「情報がユーザーに伝えたいことは何か？」を常に問いながら、PC/スマートフォン/タブレットそれぞれに最適化したUIを設計' },
      { phase: '制作', title: 'デザインガイドライン作成', description: 'Sketch + Zeplinの導入を推進し、デザインと開発の連携を効率化。Frontifyでデザインガイドラインを管理' },
      { phase: '制作', title: 'プロトタイプ作成', description: 'Prottを使用して画面遷移のプロトタイプを作成し、関係者との認識合わせを実施', images: ['/images/projects/img-137.jpg'] },
      { phase: '評価', title: 'KPT分析による継続的改善', description: 'リリース後のKPT（Keep/Problem/Try）分析を実施して、継続的な改善サイクルを回す' },
    ],
  },

  // 電気機器業界 (2004-2016)
  {
    slug: 'conte-home',
    title: 'IoTデバイスコントロールアプリ',
    subtitle: 'Conteホーム プロトタイプ',
    category: 'electronics',
    period: '2016年',
    description: 'Z-Wave規格のIoTホームオートメーションアプリのUIプロトタイプ。センサー間の連携を「シナリオ」として作成できる機能を提案。',
    roles: [
      '主要な画面設計',
      '画面遷移設計',
      'ビットマップリソース作成',
      'ビジュアルデザイン',
      '人間中心設計に基づいたUIデザインの推進',
    ],
    tools: ['Prott'],
    highlights: [
      '部屋ごとのセンサー管理UI',
      'シナリオ作成機能のUI設計（SONY MESH参考）',
      'カードUIベースの直感的なインターフェース',
    ],
    images: ['/images/projects/conte-home-overview.jpg', '/images/projects/conte-home-room-ui.jpg', '/images/projects/conte-home-scenarios.jpg', '/images/projects/conte-home-sensor.png', '/images/projects/conte-home-cards.jpg'],
    url: 'http://www.pixela.co.jp/products/network/pix_gw100z/',
  },
  {
    slug: 'plane-analyzer-plus',
    title: 'Plane Analyzer Plus',
    subtitle: 'ゴルフスイング改善ツール',
    category: 'electronics',
    period: '2015年3月〜',
    description: 'ゴルフスイングを分析するセンサーとスマートフォンアプリ。Material Designを早期採用し、人間中心設計のプロセスを実践。',
    roles: [
      '主要な画面設計',
      '画面遷移設計',
      'ビジュアルデザイン',
      'ビットマップリソース作成',
      'センサー本体デザイン',
      'ブランディング',
      '人間中心設計に基づいたUIデザインの推進',
    ],
    tools: ['Prott', '3Dプリンター'],
    highlights: [
      'ユーザーインタビューとフィールドリサーチの実施',
      'Material Designの早期採用',
      'センサー本体のコンセプトデザイン',
      '3Dプリンターによるプロトタイプ試作',
    ],
    images: ['/images/projects/plane-analyzer-main.png', '/images/projects/plane-analyzer-awards.png', '/images/projects/plane-analyzer-app-ui.png', '/images/projects/plane-analyzer-device.png'],
    awards: ['2015年 GOOD DESIGN賞', '2016年 HCDグッドプラクティスアウォード 9選'],
    url: 'http://www.pixela.co.jp/products/mobile/pix_gs100/',
    process: [
      { phase: '企画', title: 'リサーチ：インタビュー', description: '本製品のアドバイザーとして契約したティーチングプロの生徒さんに対して、直接またはいくつかのインタビュー項目を作成してゴルフについての価値観や嗜好する点、あるいは不満や滞っているレッスンを先方経由でヒアリング' },
      { phase: '企画', title: 'リサーチ：観察', description: 'エンジニアが練習場のレッスンを見学にいった際に同行して自社製品のセンサー機器と競合他社製品のセンサー機器を観察し、本製品の利用シーンの理解を深める' },
      { phase: '企画', title: 'リサーチ：店舗調査', description: '自分でゴルフ専門店やスポーツ用品店を取り扱うスポーツ用品店でセンサーや通電する練習器具などのディスプレイ展示を観察。ユーザーのタッチポイントからイメージサイズの想定や梱包材のデザイン案予習に活かす' },
      { phase: '企画', title: '要件定義', description: 'インタビューや競合各社製品の利用シーンから得られた本質的要求をプロジェクトマネージャーに提案。本質的な価値提供のために必要な機能要求を協議して仕様確認を作成' },
      { phase: '制作', title: '本体デザイン：コンセプトデザイン', description: '本体製品のセンサーの外観デザインについて担当の機構設計エンジニアと密にコミュニケーションを取り、充電対応や寸法設計により、技術的に実現可能なアイデアスケッチの方向性を検討' },
      { phase: '制作', title: 'アプリUIデザイン：ストーリーボーディング', description: 'センサーの操作とスマートフォンを使用した利用シーンのストーリーボードを作成して、操作の流れが多岐に渡る難易度の高いUIをスムーズにフォローできる、UIをデザイン' },
      { phase: '制作', title: 'アプリUIデザイン', description: '先行して開発に着手したAndroid版について、当時発表されたばかりのMaterial Designを採用して、できる限りAndroidのデザインガイドラインに沿うようにデザイン' },
      { phase: '制作', title: '本体デザイン', description: 'プロダクトデザイナーに協力し、3Dプリンターを活用して本体モックアップの試作を重ね、実物大での使用感を評価' },
      { phase: '制作', title: '個装箱デザイン・プロモーション制作物デザイン', description: '個装箱を始め、すべてのプロモーションツールの制作を担当したことで、一貫性のあるブランディングを実現' },
      { phase: '評価', title: '評価：現地テスト', description: '通電して動作するプロトタイプを練習場に持ち込み、社長の前でゴルフの上級者〜中・初級者がハードウェアとソフトウェアをペアリングさせて製品を使用する上でのトラブルのポイントをアプリのUIデザインの改善に生かす' },
      { phase: '評価', title: '外部からの評価', description: 'センサーとスポーツの融合による人間中心設計のプロセスの実践的な取り組みが評価され、2015年のGOOD DESIGN賞を受賞。また、開発から現地テストに至る人間中心設計の取り組みが評価され、2016年のHCDグッドプラクティスアウォードの9選に選ばれた' },
    ],
  },
  {
    slug: 'stationtv-windows8',
    title: 'StationTV (Windows 8)',
    subtitle: 'ワイヤレステレビ向けテレビ視聴アプリケーション',
    category: 'electronics',
    period: '2012年11月〜',
    description: 'Windows 8のModern UIに対応したテレビ視聴・録画アプリ。人間中心設計プロセスによる番組表のユーザビリティ改善を実施。',
    roles: [
      '主要な画面設計',
      '画面遷移設計',
      'ビジュアルデザイン',
      'ビットマップリソース作成',
      'ブランディング',
      '人間中心設計に基づいたUI改善提案',
    ],
    tools: ['Adobe XD'],
    highlights: [
      'Windows 8 Modern UIへの対応',
      '上位下位関係分析による本質的要求の抽出',
      '構造化シナリオの作成',
      'ペーパープロトタイプでのユーザビリティ評価',
    ],
    images: ['/images/projects/stationtv-win8-main.jpg', '/images/projects/stationtv-win8-epg.jpg', '/images/projects/stationtv-win8-player.jpg', '/images/projects/stationtv-win8-modern-ui.jpg'],
    awards: ['2014年 GOOD DESIGN賞（フリックカード選局インターフェース）'],
    url: 'http://www.pixela.co.jp/products/tv_capture/pix_br310l/',
    process: [
      { phase: '企画', title: '要件定義', description: '技術的制約の多い家のQに対してテレビ視聴・録画アプリとしての書籍用の要求価値をエンジニアと協力して模索し、段階的な機能のリリースを計画' },
      { phase: '制作', title: '情報設計', description: '発表されたばかりのWindows 8のModern UIに対応するために、Microsoftから先行して提供されたドラフト段階のデザインガイドラインのドキュメントを読み込み、独自の解釈を加味し上で大まかにModern UIに落とし込むための情報設計を実施' },
      { phase: '制作', title: 'UIデザイン', description: 'Modern UIの思想でタッチ操作を想定した大きなタイル型のUIに合わせたデザインを作成。スケジュールと技術的な制限を鑑みながら、電子番組表を組込んだ番組検索、手軽な録画と再生といったテレビアプリの利用体験としては致命的な欠陥を回避しつつ段階的なリリースとなりました' },
      { phase: '制作', title: '改善活動の計画', description: 'エンジニアのスケジュールが確保できた時点で番組表の抜本的な改善を行うため、私と番組表の実装を担当するエンジニアがリードする形で人間中心設計（HCD）の改善プロセスを推進' },
      { phase: '制作', title: 'ユーザーの本質的要求の抽出', description: 'ユーザーとして利用した時の感じた不満点や改善点をカードに可視化して上位下位分析を行い、本質的要求の抽出と優先順位の整理を実施' },
      { phase: '制作', title: '構造化シナリオ', description: '本質的要求を満たすための具体的なインタラクションをUIに落とし込むために、技術的な課題をエンジニアと検証しつつ構造化シナリオリスト作成。シナリオに最適なシナリオのライティングを担当' },
      { phase: '評価', title: 'ペーパープロトタイプでのユーザビリティ評価', description: '番組表を利用する上でのクリティカルなシナリオのインタラクションを再現するペーパープロトタイプを作成した社員に対してユーザビリティ評価を行い、コーディングの実装前に課題の抽出を早々で達成' },
      { phase: '評価', title: '改善後のアプリでのユーザビリティ評価', description: '実装のアプリで再度テレビアプリに関わりの深い社員に対してユーザビリティ評価を実施して、改善の効果を確認したところ、本製品で採用している「フリックカード選局」インターフェースが、2014年度のグッドデザイン賞を受賞' },
    ],
  },
  {
    slug: 'stationtv-mobile',
    title: 'StationTV (iOS/Android)',
    subtitle: 'ワイヤレステレビ向けテレビ視聴アプリケーション',
    category: 'electronics',
    period: '2011年〜',
    description: 'iOS/Android向けのワイヤレステレビ視聴アプリ。スマートフォンとタブレット両方に対応したUI設計。',
    roles: [
      '主要な画面設計',
      '画面遷移設計',
      'ビジュアルデザイン',
      'ビットマップリソース作成',
      'ブランディング',
    ],
    tools: [],
    highlights: [
      'iOS/Android両プラットフォーム対応',
      'スマートフォン・タブレット両対応のUI',
      'iOS 6からiOS 7移行時のフラットデザイン対応',
    ],
    images: ['/images/projects/stationtv-mobile-ios.jpg', '/images/projects/stationtv-mobile-android.jpg', '/images/projects/stationtv-mobile-tablet.jpg'],
    awards: ['2014年 GOOD DESIGN賞（フリックカード選局インターフェース）'],
    url: 'http://www.pixela.co.jp/products/tv_capture/pix_br310l/',
  },
  {
    slug: 'videobrowser',
    title: 'VideoBrowser',
    subtitle: 'ビデオカメラバンドルアプリケーション',
    category: 'electronics',
    period: '2011年〜',
    description: 'キヤノンのビデオカメラにバンドルされる映像管理アプリケーション。リッチで品質の高さを感じられるビジュアルデザインを追求。',
    roles: [
      '企画提案のためのコンセプトデザイン作成',
      '主要な画面設計',
      '画面遷移設計',
      'ビジュアルデザイン',
      'レイアウト指示書作成',
      'ビットマップリソース作成',
      'ブランディング',
    ],
    tools: [],
    highlights: [
      'ウィザード形式UIの提案',
      '多言語対応を考慮したデザイン',
      'リッチで品質の高いビジュアル',
    ],
    images: ['/images/projects/videobrowser-main.jpg', '/images/projects/videobrowser-wizard.jpg'],
    url: 'http://www.pixela.co.jp/oem/canon/j/videobrowser_ver2/',
  },
  {
    slug: 'mediabrowser',
    title: 'MediaBrowser',
    subtitle: 'ビデオカメラバンドルアプリケーション',
    category: 'electronics',
    period: '2009年〜',
    description: 'JVCケンウッドのビデオカメラにバンドルされる映像管理アプリケーション。ブランドロゴのコンセプトデザインから担当。',
    roles: [
      '企画提案のためのコンセプトデザイン作成',
      '主要な画面設計',
      '画面遷移設計',
      'ビジュアルデザイン',
      'レイアウト指示書作成',
      'ビットマップリソース作成',
      'ブランディング',
    ],
    tools: [],
    highlights: [
      'M+Bで蝶をモチーフにしたブランドロゴ',
      'ウィザード形式UIの提案',
      '2011年にビジュアルリニューアル',
    ],
    images: ['/images/projects/mediabrowser-main.jpg', '/images/projects/mediabrowser-ui.jpg'],
    url: 'http://www.pixela.co.jp/oem/jvc/mediabrowser/j/',
  },
  {
    slug: 'settop-box',
    title: 'セットトップボックス',
    subtitle: 'ケーブルテレビ事業者向けSTB',
    category: 'electronics',
    period: '2014年〜',
    description: 'ケーブルテレビ事業者向けのスピーカー内蔵IP-STBの本体とリモコンの外観デザインを提案。',
    roles: [
      '本体外観デザインの提案',
      'リモコン外観デザインの提案',
    ],
    tools: [],
    highlights: [
      'スピーカー内蔵STBの本体デザイン',
      '使いやすさを追求したリモコンデザイン',
    ],
    images: ['/images/projects/settop-box-design.jpg'],
    url: 'http://www.pixela.co.jp/biz/avc/ip_stb/spec.html',
  },
  {
    slug: 'package-design',
    title: '製品パッケージ・ロゴデザイン',
    subtitle: 'リテール向け製品パッケージのデザイン',
    category: 'electronics',
    period: '2004年〜2014年',
    description: 'Mac向けDVDドライブ、テレビチューナー、液晶テレビなど様々な製品のパッケージデザインとロゴタイプ・ロゴマークのデザインを担当。',
    roles: [
      '製品パッケージデザイン',
      'ロゴタイプデザイン',
      'ロゴマークデザイン',
    ],
    tools: [],
    highlights: [
      'Mac向けDVDドライブ製品（2004年、2005年）',
      'Mac向けテレビチューナー製品（2007年、2009年）',
      'Windows向けテレビチューナー製品（2008年、2012年）',
      '液晶テレビ（2011年、2012年）',
      'iOS向けテレビチューナー製品（2014年）',
    ],
    images: ['/images/projects/package-mac-tuner.jpg', '/images/projects/package-mac-dvd-2005.jpg', '/images/projects/package-mac-dvd.jpg', '/images/projects/package-stb.jpg', '/images/projects/package-stb-detail.jpg', '/images/projects/package-tv-tuner.jpg', '/images/projects/package-lcd-tv.jpg', '/images/projects/package-ios-tuner.jpg', '/images/projects/package-windows-tuner.jpg'],
  },
];

export const categories = [
  { id: 'all', label: 'すべて' },
  { id: 'web', label: 'ウェブサービス開発' },
  { id: 'electronics', label: '電気機器業界' },
] as const;

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectsByCategory(category: ProjectCategory | 'all'): Project[] {
  if (category === 'all') return projects;
  return projects.filter((p) => p.category === category);
}
