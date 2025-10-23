/* global chrome */
(function () {
  const rowsEl = document.getElementById('rows');
  const filterEl = document.getElementById('filter');
  const clearBtn = document.getElementById('clear');

  /** @type {Array<any>} */
  const entries = [];

  function render() {
    const q = (filterEl.value || '').toLowerCase();
    rowsEl.innerHTML = '';
    for (const e of entries) {
      if (q && !(e.request.url.toLowerCase().includes(q) || e.request.method.toLowerCase().includes(q))) continue;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${e.request.method}</td>
        <td class="mono" title="${e.request.url}">${e.request.url}</td>
        <td>${e.response?.status || ''}</td>
        <td>${e.type || ''}</td>
        <td class="mono">${e.time || ''}</td>
        <td>
          <button data-action="copy" data-id="${e.id}">Copy cURL</button>
          <button data-action="replay" data-id="${e.id}">Replay</button>
        </td>
      `;
      rowsEl.appendChild(tr);
    }
  }

  function toCurl(e) {
    const { method, url, headers, postData } = e.request;
    const lines = [`curl -X ${method} --compressed \\\n+  '${url}'`];
    for (const [k, v] of Object.entries(headers || {})) {
      lines.push(`  -H '${k}: ${String(v)}'`);
    }
    if (postData) {
      lines.push(`  --data '${typeof postData === 'string' ? postData : JSON.stringify(postData)}'`);
    }
    return lines.join(' \\\n+');
  }

  // Track requests in the inspected page
  chrome.devtools.network.onRequestFinished.addListener(function (request) {
    try {
      const started = request.startedDateTime ? new Date(request.startedDateTime).getTime() : Date.now();
      request.getContent(function (_body) {
        const entry = {
          id: `${started}-${Math.random().toString(36).slice(2)}`,
          request: {
            method: request.request.method,
            url: request.request.url,
            headers: Object.fromEntries((request.request.headers || []).map(h => [h.name, h.value])),
            postData: request.request.postData?.text,
          },
          response: {
            status: request.response.status,
          },
          type: request._resourceType || request.response?.content?.mimeType,
          time: request.time,
        };
        entries.push(entry);
        render();
      });
    } catch (err) {
      // ignore
    }
  });

  rowsEl.addEventListener('click', async function (e) {
    const target = e.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const id = target.getAttribute('data-id');
    const action = target.getAttribute('data-action');
    const entry = entries.find(x => x.id === id);
    if (!entry) return;

    if (action === 'copy') {
      const text = toCurl(entry);
      try {
        await navigator.clipboard.writeText(text);
      } catch (_) {}
    }

    if (action === 'replay') {
      // Relay to background via inspected window context
      chrome.runtime.sendMessage({ type: 'devtools_replay_request', request: entry.request });
    }
  });

  clearBtn.addEventListener('click', function () {
    entries.length = 0;
    render();
  });

  filterEl.addEventListener('input', render);
})();
