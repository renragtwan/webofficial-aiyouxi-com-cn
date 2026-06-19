// public/site-helper.js
(function() {
  'use strict';

  // 配置数据
  const config = {
    siteUrl: 'https://webofficial-aiyouxi.com.cn',
    keyword: '爱游戏',
    cacheDuration: 3600 * 1000 // 1小时缓存
  };

  // 样式注入
  const style = document.createElement('style');
  style.textContent = `
    .helper-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      border-radius: 12px;
      padding: 16px 20px;
      margin: 12px 0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      position: relative;
      overflow: hidden;
    }
    .helper-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      transform: rotate(30deg);
    }
    .helper-card-title {
      font-size: 1.1em;
      font-weight: 600;
      margin-bottom: 6px;
      position: relative;
      z-index: 1;
    }
    .helper-card-text {
      font-size: 0.9em;
      opacity: 0.9;
      line-height: 1.5;
      position: relative;
      z-index: 1;
    }
    .helper-card-link {
      color: #ffd700;
      text-decoration: underline;
      cursor: pointer;
    }
    .keyword-badge {
      display: inline-block;
      background: #ff6b6b;
      color: #fff;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8em;
      font-weight: 500;
      margin: 4px 6px 4px 0;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .keyword-badge.highlight {
      background: #ffa502;
    }
    .access-notice {
      background: #f1f2f6;
      border-left: 4px solid #667eea;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin: 10px 0;
      font-size: 0.9em;
      color: #2f3542;
    }
    .access-notice strong {
      color: #3742fa;
    }
    .helper-close {
      position: absolute;
      top: 8px;
      right: 12px;
      background: none;
      border: none;
      color: rgba(255,255,255,0.8);
      font-size: 1.2em;
      cursor: pointer;
      z-index: 2;
      padding: 0 4px;
      line-height: 1;
    }
    .helper-close:hover {
      color: #fff;
    }
  `;
  document.head.appendChild(style);

  // 数据存储
  let dismissedCards = new Set();

  // 从 localStorage 恢复已关闭状态
  function loadDismissed() {
    try {
      const stored = localStorage.getItem('siteHelperDismissed');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dismissedCards = new Set(parsed);
        }
      }
    } catch (e) {
      // 忽略
    }
  }

  function saveDismissed() {
    try {
      localStorage.setItem('siteHelperDismissed', JSON.stringify([...dismissedCards]));
    } catch (e) {
      // 忽略
    }
  }

  // 生成唯一卡片 ID
  function cardId(name) {
    return 'card_' + name;
  }

  // 创建提示卡片
  function createTipCard(title, text, linkText, linkUrl) {
    const id = cardId(title);
    if (dismissedCards.has(id)) return null;

    const card = document.createElement('div');
    card.className = 'helper-card';
    card.dataset.cardId = id;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'helper-close';
    closeBtn.textContent = '×';
    closeBtn.setAttribute('aria-label', '关闭');
    closeBtn.addEventListener('click', function() {
      dismissedCards.add(id);
      saveDismissed();
      card.remove();
    });

    const titleEl = document.createElement('div');
    titleEl.className = 'helper-card-title';
    titleEl.textContent = title;

    const textEl = document.createElement('div');
    textEl.className = 'helper-card-text';
    if (linkText && linkUrl) {
      const parts = text.split(linkText);
      if (parts.length > 1) {
        textEl.textContent = parts[0];
        const anchor = document.createElement('a');
        anchor.className = 'helper-card-link';
        anchor.href = linkUrl;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.textContent = linkText;
        textEl.appendChild(anchor);
        textEl.appendChild(document.createTextNode(parts[1]));
      } else {
        textEl.textContent = text;
      }
    } else {
      textEl.textContent = text;
    }

    card.appendChild(closeBtn);
    card.appendChild(titleEl);
    card.appendChild(textEl);
    return card;
  }

  // 创建关键词徽章组
  function createKeywordBadges(keywords) {
    const container = document.createElement('div');
    container.style.margin = '10px 0';
    keywords.forEach(function(kw, idx) {
      const badge = document.createElement('span');
      badge.className = 'keyword-badge' + (idx === 0 ? ' highlight' : '');
      badge.textContent = kw;
      container.appendChild(badge);
    });
    return container;
  }

  // 创建访问说明
  function createAccessNotice() {
    const notice = document.createElement('div');
    notice.className = 'access-notice';
    notice.innerHTML = '<strong>说明：</strong> 本站为 <a href="' + config.siteUrl + '" target="_blank" rel="noopener noreferrer">' + config.siteUrl + '</a> 的辅助页面，主要围绕“<strong>' + config.keyword + '</strong>”提供资讯与导航。请通过上方链接访问主站。';
    return notice;
  }

  // 初始化
  function init() {
    loadDismissed();

    // 寻找合适的插入位置（优先在 main 或 article 内开头）
    const target = document.querySelector('main, article, .content, #content');
    const insertPoint = target ? target : document.body;

    // 插入提示卡片
    const tipCard = createTipCard(
      '💡 新手指南',
      '欢迎来到我们的网站！这里汇聚了关于 ' + config.keyword + ' 的最新动态与深度内容。点击 访问官网 获取完整信息。',
      '访问官网',
      config.siteUrl
    );
    if (tipCard) {
      insertPoint.insertBefore(tipCard, insertPoint.firstChild);
    }

    // 插入关键词徽章（示例数据）
    const keywords = [config.keyword, '游戏资讯', '玩家社区', '攻略分享'];
    const badgeGroup = createKeywordBadges(keywords);
    if (target) {
      target.insertBefore(badgeGroup, target.firstChild);
    } else {
      document.body.insertBefore(badgeGroup, document.body.firstChild);
    }

    // 插入访问说明
    const notice = createAccessNotice();
    if (target) {
      target.insertBefore(notice, target.firstChild);
    } else {
      document.body.insertBefore(notice, document.body.firstChild);
    }
  }

  // 在 DOM 就绪后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();