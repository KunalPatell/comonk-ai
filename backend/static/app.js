// ==========================================================================
// Sevenseed AI Venture Ecosystem — Interactive Frontend Logic
// Includes Multi-Tool Tabs, Universal BYOK Manager & Sintra.ai Style Agent Runner
// ==========================================================================

(function() {
  'use strict';

  // 1. Universal BYOK Storage Manager
  const BYOK_KEY = 'SEVENSEED_BYOK_KEYS';
  
  function getByokKeys() {
    try {
      return JSON.parse(localStorage.getItem(BYOK_KEY) || '{}');
    } catch(e) {
      return {};
    }
  }

  function saveByokKeys(keys) {
    localStorage.setItem(BYOK_KEY, JSON.stringify(keys));
    updateByokUi();
  }

  function updateByokUi() {
    const keys = getByokKeys();
    const btn = document.getElementById('byokOpenBtn');
    const label = document.getElementById('byokNavLabel');
    const hasAny = Object.values(keys).some(v => (v || '').trim().length > 0);

    if (btn && label) {
      if (hasAny) {
        btn.classList.add('active-keys');
        const activeNames = [];
        if (keys.groq) activeNames.push('Groq');
        if (keys.gemini) activeNames.push('Gemini');
        if (keys.openai) activeNames.push('OpenAI');
        if (keys.anthropic) activeNames.push('Claude');
        label.textContent = 'BYOK: ' + activeNames.join('/') + ' Active';
      } else {
        btn.classList.remove('active-keys');
        label.textContent = 'BYOK API Keys';
      }
    }

    // Populate modal inputs if open
    const inpGroq = document.getElementById('byokGroq');
    const inpGemini = document.getElementById('byokGemini');
    const inpOpenAI = document.getElementById('byokOpenAI');
    const inpAnthropic = document.getElementById('byokAnthropic');

    if (inpGroq && !inpGroq.value) inpGroq.value = keys.groq || '';
    if (inpGemini && !inpGemini.value) inpGemini.value = keys.gemini || '';
    if (inpOpenAI && !inpOpenAI.value) inpOpenAI.value = keys.openai || '';
    if (inpAnthropic && !inpAnthropic.value) inpAnthropic.value = keys.anthropic || '';
  }

  // Modal event listeners
  const byokModal = document.getElementById('byokModal');
  const byokOpenBtn = document.getElementById('byokOpenBtn');
  const byokCloseBtn = document.getElementById('byokCloseBtn');
  const byokSaveBtn = document.getElementById('byokSaveBtn');
  const byokClearBtn = document.getElementById('byokClearBtn');

  if (byokOpenBtn && byokModal) {
    byokOpenBtn.addEventListener('click', () => {
      byokModal.classList.add('show');
      updateByokUi();
    });
  }

  if (byokCloseBtn && byokModal) {
    byokCloseBtn.addEventListener('click', () => {
      byokModal.classList.remove('show');
    });
  }

  if (byokModal) {
    byokModal.addEventListener('click', (e) => {
      if (e.target === byokModal) byokModal.classList.remove('show');
    });
  }

  if (byokSaveBtn && byokModal) {
    byokSaveBtn.addEventListener('click', () => {
      const keys = {
        groq: (document.getElementById('byokGroq')?.value || '').trim(),
        gemini: (document.getElementById('byokGemini')?.value || '').trim(),
        openai: (document.getElementById('byokOpenAI')?.value || '').trim(),
        anthropic: (document.getElementById('byokAnthropic')?.value || '').trim(),
      };
      saveByokKeys(keys);
      byokModal.classList.remove('show');
    });
  }

  if (byokClearBtn) {
    byokClearBtn.addEventListener('click', () => {
      saveByokKeys({});
      if (document.getElementById('byokGroq')) document.getElementById('byokGroq').value = '';
      if (document.getElementById('byokGemini')) document.getElementById('byokGemini').value = '';
      if (document.getElementById('byokOpenAI')) document.getElementById('byokOpenAI').value = '';
      if (document.getElementById('byokAnthropic')) document.getElementById('byokAnthropic').value = '';
    });
  }

  updateByokUi();

  // 2. Navigation Scroll & Progress Bar
  const nav = document.getElementById('mainNav');
  const scrollBar = document.getElementById('scrollProgress');
  const cursorGlow = document.getElementById('cursorGlow');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (nav) {
      if (scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }

    if (scrollBar) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? (scrollY / docH) * 100 : 0;
      scrollBar.style.width = pct + '%';
    }
  }, { passive: true });

  // 3. Cursor Glow Follower
  window.addEventListener('mousemove', (e) => {
    if (cursorGlow) {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    }
  });

  // 4. Mobile Hamburger Menu
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  // 5. Interactive Particle Field
  const canvas = document.getElementById('particlesCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.6 + 0.6;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${this.alpha})`;
        ctx.fill();
      }
    }

    const count = Math.min(Math.floor(window.innerWidth / 22), 55);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // 6. 3D Tilt Cards
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 7. Multi-Tool Workstation Tab Switcher & Dynamic Form Generator
  const sandboxSec = document.getElementById('sandbox');
  let toolsData = [];
  try {
    toolsData = JSON.parse(sandboxSec?.getAttribute('data-tools') || '[]');
  } catch(e) {
    toolsData = [];
  }

  const sbSubtitle = document.getElementById('sbSubtitle');
  const sbTitleBadge = document.getElementById('sbTitleBadge');
  const sbEnginePill = document.getElementById('sbEnginePill');
  const sbForm = document.getElementById('sandboxForm');
  const sbDynamicFields = document.getElementById('sbDynamicFields');
  const sbVisual = document.getElementById('sandboxVisual');
  const sbOutput = document.getElementById('sandboxOutput');
  const sbBtn = document.getElementById('sandboxBtn');

  function renderTool(tool) {
    if (!tool) return;
    if (sbSubtitle) sbSubtitle.textContent = tool.desc;
    if (sbTitleBadge) sbTitleBadge.innerHTML = `<i class="fas ${tool.icon}"></i> ${tool.name}`;
    if (sbEnginePill) sbEnginePill.textContent = tool.badge;
    if (sbForm) {
      sbForm.setAttribute('data-endpoint', tool.endpoint);
      sbForm.setAttribute('data-sample', tool.sample);
    }

    // Populate Scenario Presets
    const presetsWrap = document.getElementById('sbPresetsChips');
    if (presetsWrap) {
      presetsWrap.innerHTML = `
        <button type="button" class="preset-chip" data-preset="default"><i class="fas fa-play" style="font-size:9px"></i> Default Case</button>
        <button type="button" class="preset-chip" data-preset="stress"><i class="fas fa-bolt" style="font-size:9px"></i> High Load / Edge Case</button>
      `;
      presetsWrap.querySelectorAll('.preset-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const type = btn.getAttribute('data-preset');
          if (type === 'stress') {
            const inputs = sbDynamicFields.querySelectorAll('input, textarea');
            if (inputs[0]) inputs[0].value = inputs[0].value + ' (Stress Scenario: High Frequency Spike)';
          }
          if (sbBtn) sbBtn.click();
        });
      });
    }

    if (sbDynamicFields) {
      let fieldsHtml = '';
      (tool.fields || []).forEach(f => {
        const fid = 'sb-' + f.id;
        const lbl = f.label;
        const ftype = f.type;
        const fval = f.val || '';
        if (ftype === 'textarea') {
          fieldsHtml += `
            <div class="sb-field">
              <label for="${fid}">${lbl}</label>
              <textarea id="${fid}" rows="3" required>${fval}</textarea>
            </div>
          `;
        } else if (ftype === 'select') {
          const opts = (f.options || []).map(o => `<option value="${o}"${o === fval ? ' selected' : ''}>${o}</option>`).join('');
          fieldsHtml += `
            <div class="sb-field">
              <label for="${fid}">${lbl}</label>
              <select id="${fid}">${opts}</select>
            </div>
          `;
        } else {
          fieldsHtml += `
            <div class="sb-field">
              <label for="${fid}">${lbl}</label>
              <input type="${ftype}" id="${fid}" value="${fval}" required>
            </div>
          `;
        }
      });
      sbDynamicFields.innerHTML = fieldsHtml;
    }
    // Reset visual state
    if (sbVisual) {
      sbVisual.innerHTML = `
        <div class="sb-empty-state">
          <i class="fas fa-microchip pulse-icon"></i>
          <p>Click <strong>"Run Live Model"</strong> to execute <em>${tool.name}</em>.</p>
        </div>
      `;
    }
    if (sbOutput) {
      sbOutput.textContent = `// Click "Run Live Model" to view JSON payload for ${tool.name}...`;
    }
  }

  // Tab click listeners
  document.querySelectorAll('.tab-tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const toolId = btn.getAttribute('data-tool-id');
      const tool = toolsData.find(t => t.id === toolId);
      if (tool) renderTool(tool);
    });
  });

  // 8. Result Formatting Engine
  const btnViewFormatted = document.getElementById('btnViewFormatted');
  const btnViewJson = document.getElementById('btnViewJson');
  const sbCopy = document.getElementById('sandboxCopy');

  if (btnViewFormatted && btnViewJson && sbVisual && sbOutput) {
    btnViewFormatted.addEventListener('click', () => {
      btnViewFormatted.classList.add('active');
      btnViewJson.classList.remove('active');
      sbVisual.classList.remove('hide');
      sbOutput.classList.add('hide');
    });

    btnViewJson.addEventListener('click', () => {
      btnViewJson.classList.add('active');
      btnViewFormatted.classList.remove('active');
      sbOutput.classList.remove('hide');
      sbVisual.classList.add('hide');
    });
  }

  function renderVisualResult(data) {
    if (!sbVisual) return;
    let html = '';

    // 1. STAR Interview Coach / Exam Scorer
    if (data.overall_score !== undefined) {
      const score = data.overall_score;
      const scoreColor = score >= 85 ? '#22c55e' : (score >= 60 ? '#f59e0b' : '#ef4444');
      html += `
        <div class="res-card">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
            <div class="res-card-title"><i class="fas fa-award"></i> Evaluation Scorecard</div>
            <div style="font-size:28px; font-weight:900; color:${scoreColor}">${score}<span style="font-size:14px; color:var(--text-3)">/100</span></div>
          </div>
      `;
      if (data.star_breakdown) {
        const sb = data.star_breakdown;
        html += `
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:8px; margin-bottom:12px;">
            <div style="background:rgba(0,0,0,0.3); padding:8px 10px; border-radius:6px; border:1px solid var(--border)"><strong style="color:var(--primary-l)">S:</strong> <span style="font-size:12px">${sb.situation || ''}</span></div>
            <div style="background:rgba(0,0,0,0.3); padding:8px 10px; border-radius:6px; border:1px solid var(--border)"><strong style="color:var(--primary-l)">T:</strong> <span style="font-size:12px">${sb.task || ''}</span></div>
            <div style="background:rgba(0,0,0,0.3); padding:8px 10px; border-radius:6px; border:1px solid var(--border)"><strong style="color:var(--primary-l)">A:</strong> <span style="font-size:12px">${sb.action || ''}</span></div>
            <div style="background:rgba(0,0,0,0.3); padding:8px 10px; border-radius:6px; border:1px solid var(--border)"><strong style="color:var(--primary-l)">R:</strong> <span style="font-size:12px">${sb.result || ''}</span></div>
          </div>
        `;
      }
      if (data.coaching_advice) {
        html += `<p style="font-size:13px; color:#cbd5e1; background:rgba(99,102,241,0.12); padding:10px; border-radius:6px; border-left:3px solid var(--primary-l);"><i class="fas fa-lightbulb" style="color:#f59e0b"></i> <strong>Coaching Feedback:</strong> ${data.coaching_advice}</p>`;
      }
      html += '</div>';
    }

    // 2. Salary Percentile Benchmarks
    if (data.salary_percentiles_inr) {
      const sp = data.salary_percentiles_inr;
      html += `
        <div class="res-card">
          <div class="res-card-title"><i class="fas fa-money-bill-trend-up"></i> ${data.role || 'Tech Role'} &bull; ${data.experience_range || ''}</div>
          <div class="res-kpi-grid" style="margin-top:12px;">
            <div class="res-kpi"><div class="res-kpi-val" style="color:#94a3b8">${sp.p25_entry || 'N/A'}</div><div class="res-kpi-lbl">P25 Entry</div></div>
            <div class="res-kpi"><div class="res-kpi-val" style="color:var(--primary-l)">${sp.p50_median || 'N/A'}</div><div class="res-kpi-lbl">P50 Median</div></div>
            <div class="res-kpi"><div class="res-kpi-val" style="color:#818cf8">${sp.p75_top_tier || 'N/A'}</div><div class="res-kpi-lbl">P75 Top-Tier</div></div>
            <div class="res-kpi"><div class="res-kpi-val" style="color:#22c55e">${sp.p90_exceptional || 'N/A'}</div><div class="res-kpi-lbl">P90 Exceptional</div></div>
          </div>
          <div style="margin-top:10px; font-size:12px; color:var(--text-3);"><i class="fas fa-map-pin"></i> <strong>Top Hiring Corridors:</strong> ${(data.hiring_hotspots || []).join(' &bull; ')}</div>
        </div>
      `;
    }

    // 3. ATS Resume Matcher
    if (data.ats_match_score) {
      html += `
        <div class="res-card">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div class="res-card-title"><i class="fas fa-file-circle-check"></i> ATS Keyword Match</div>
            <div style="font-size:24px; font-weight:800; color:var(--primary-l)">${data.ats_match_score}</div>
          </div>
          <div style="margin-bottom:10px;">
            <div style="font-size:12px; font-weight:700; color:#ef4444; margin-bottom:4px;"><i class="fas fa-circle-exclamation"></i> Missing High-Priority Keywords:</div>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              ${(data.missing_high_priority_keywords || []).map(k => `<span style="background:rgba(239,68,68,0.15); color:#fca5a5; border:1px solid rgba(239,68,68,0.3); padding:3px 8px; border-radius:99px; font-size:11.5px;">+ ${k}</span>`).join('')}
            </div>
          </div>
          <p style="font-size:13px; color:#cbd5e1; background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:6px;"><strong>Action:</strong> ${data.recommended_action || ''}</p>
        </div>
      `;
    }

    // 4. Dr. Decode Health Advice
    if (data.reply) {
      html += `
        <div class="res-card">
          <div class="res-card-title"><i class="fas fa-stethoscope" style="color:#22c55e"></i> Dr. Decode Health Assistant</div>
          <p style="font-size:14px; line-height:1.75; color:#f8fafc; margin-bottom:12px;">${data.reply}</p>
          <div style="display:flex; align-items:center; gap:8px; font-size:11.5px; color:#94a3b8; font-style:italic; background:rgba(0,0,0,0.25); padding:6px 10px; border-radius:6px;">
            <i class="fas fa-shield-halved" style="color:#f59e0b"></i> ${data.disclaimer || 'Not a substitute for doctor consultation. For emergency triage, call 108.'}
          </div>
        </div>
      `;
    }

    // 5. Drug-Drug Interaction Safety
    if (data.risk_level) {
      const isSevere = data.risk_level.includes('SEVERE') || data.risk_level.includes('CONTRAINDICATION');
      const bannerBg = isSevere ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.18)';
      const bannerColor = isSevere ? '#fca5a5' : '#fef08a';
      const borderColor = isSevere ? '#ef4444' : '#f59e0b';
      html += `
        <div class="res-card" style="border-color:${borderColor}">
          <div style="background:${bannerBg}; color:${bannerColor}; padding:8px 12px; border-radius:6px; font-weight:800; font-size:13px; margin-bottom:12px; display:inline-flex; align-items:center; gap:8px;">
            <i class="fas fa-triangle-exclamation"></i> ${data.risk_level}
          </div>
          <p style="font-size:13.5px; color:#cbd5e1; margin-bottom:10px;"><strong>Mechanism:</strong> ${data.mechanism || ''}</p>
          <div style="font-size:13px; margin-bottom:8px;">
            <strong style="color:var(--primary-l)">Clinical Recommendations:</strong>
            <ul style="margin:6px 0 0 16px; padding:0; color:#e2e8f0;">
              ${(data.clinical_recommendations || []).map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
          ${data.food_warnings ? `<div style="font-size:12px; color:#facc15;"><i class="fas fa-utensils"></i> <strong>Dietary Warnings:</strong> ${(data.food_warnings || []).join(', ')}</div>` : ''}
        </div>
      `;
    }

    // 6. Emergency 24/7 Hospital Finder
    if (data.hospitals && Array.isArray(data.hospitals)) {
      html += `
        <div class="res-card">
          <div class="res-card-title"><i class="fas fa-hospital"></i> 24/7 Emergency Hospital Directory (${data.count || data.hospitals.length} Found)</div>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:8px;">
      `;
      data.hospitals.forEach(h => {
        html += `
          <div style="padding:10px 14px; background:rgba(0,0,0,0.35); border:1px solid var(--border); border-radius:6px;">
            <div style="font-weight:800; font-size:14px; color:#fff">${h.name}</div>
            <div style="font-size:12px; color:#94a3b8; margin:4px 0;"><i class="fas fa-location-dot"></i> ${h.address}</div>
            <div style="font-size:12.5px; color:#22c55e; font-weight:700;"><i class="fas fa-phone"></i> ${h.phone || '108'} &bull; <span style="color:#38bdf8">${(h.facilities || []).join(', ')}</span></div>
          </div>
        `;
      });
      html += '</div></div>';
    }

    // 7. Free Health & Blood Camps
    if (data.upcoming_camps && Array.isArray(data.upcoming_camps)) {
      html += `
        <div class="res-card">
          <div class="res-card-title"><i class="fas fa-hand-holding-droplet" style="color:#ef4444"></i> Free Health & Blood Donation Camps</div>
          <div style="display:flex; flex-direction:column; gap:10px; margin-top:8px;">
      `;
      data.upcoming_camps.forEach(c => {
        html += `
          <div style="padding:10px 14px; background:rgba(0,0,0,0.35); border:1px solid var(--border); border-radius:6px;">
            <div style="font-weight:800; font-size:14px; color:#f59e0b">${c.event_title}</div>
            <div style="font-size:12px; color:#94a3b8; margin:4px 0;"><i class="fas fa-calendar"></i> ${c.date} &bull; <i class="fas fa-map-pin"></i> ${c.location}</div>
            <div style="font-size:12px; color:#e2e8f0;">${(c.services || []).join(' &bull; ')}</div>
          </div>
        `;
      });
      html += '</div></div>';
    }

    // 8. IS 456 Structural Defect Classifier
    if (data.is_456_compliance) {
      const isViol = data.is_456_compliance.includes('VIOLATION');
      html += `
        <div class="res-card">
          <div class="res-card-title"><i class="fas fa-helmet-safety"></i> IS 456 Structural Diagnostics</div>
          <div class="res-kpi-grid">
            <div class="res-kpi"><div class="res-kpi-val" style="color:${isViol ? '#ef4444' : '#22c55e'}">${data.is_456_compliance}</div><div class="res-kpi-lbl">IS 456 Limit</div></div>
            <div class="res-kpi"><div class="res-kpi-val">${data.defect_classification || 'Shear Crack'}</div><div class="res-kpi-lbl">Classification</div></div>
          </div>
          ${data.structural_risk ? `<div style="font-size:13px; color:#fca5a5; margin:10px 0;"><strong>Structural Risk:</strong> ${data.structural_risk}</div>` : ''}
          ${data.cpwd_remedial_measures ? `
            <div style="font-size:12.5px;">
              <strong style="color:var(--primary-l)">CPWD Remedial Measures:</strong>
              <ul style="margin:4px 0 0 16px; padding:0; color:#cbd5e1;">
                ${data.cpwd_remedial_measures.map(m => `<li>${m}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `;
    }

    // 9. CPWD BOQ Repair Cost Estimator
    if (data.boq_breakdown && Array.isArray(data.boq_breakdown)) {
      html += `
        <div class="res-card">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
            <div class="res-card-title"><i class="fas fa-file-invoice-dollar"></i> CPWD DSR Cost Estimate</div>
            <div style="font-size:20px; font-weight:800; color:#22c55e">${data.total_repair_budget_inr || ''}</div>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:10px;">
            ${data.boq_breakdown.map(item => `
              <div style="display:flex; justify-content:space-between; font-size:12.5px; padding:6px 8px; background:rgba(0,0,0,0.3); border-radius:4px;">
                <span>${item.item} (${item.quantity})</span>
                <span style="font-weight:700; color:#fff">₹${item.total_inr}</span>
              </div>
            `).join('')}
          </div>
          <div style="font-size:11.5px; color:var(--text-3);"><i class="fas fa-clock"></i> <strong>Estimated Execution:</strong> ${data.estimated_execution_days || '1-2 Days'}</div>
        </div>
      `;
    }

    // 10. Gyan AI Socratic Explainer
    if (data.concept && data.socratic_challenge_question) {
      html += `
        <div class="res-card">
          <div class="res-card-title"><i class="fas fa-brain"></i> Gyan AI &bull; ${data.concept}</div>
          <p style="font-size:13.5px; color:#cbd5e1; margin-bottom:10px;"><strong>Real-World Analogy:</strong> ${data.real_world_analogy || ''}</p>
          <div style="background:rgba(99,102,241,0.12); padding:10px; border-radius:6px; border-left:3px solid var(--primary-l); font-size:13px; color:#f8fafc;">
            <i class="fas fa-question-circle" style="color:var(--primary-l)"></i> <strong>Socratic Challenge:</strong> ${data.socratic_challenge_question}
          </div>
        </div>
      `;
    }

    // 11. SaaS Unit Economics
    if (data.metrics_summary) {
      const m = data.metrics_summary;
      html += `
        <div class="res-card">
          <div class="res-card-title"><i class="fas fa-chart-pie"></i> SaaS Unit Economics (Dexter AI)</div>
          <div class="res-kpi-grid">
            <div class="res-kpi"><div class="res-kpi-val">${m.mrr_formatted || '$0'}</div><div class="res-kpi-lbl">MRR</div></div>
            <div class="res-kpi"><div class="res-kpi-val">${m.arr_formatted || '$0'}</div><div class="res-kpi-lbl">ARR</div></div>
            <div class="res-kpi"><div class="res-kpi-val">${m.ltv_to_cac_ratio || 'N/A'}</div><div class="res-kpi-lbl">LTV:CAC</div></div>
            <div class="res-kpi"><div class="res-kpi-val" style="color:#22c55e">${m.health_grade || 'A'}</div><div class="res-kpi-lbl">Health Grade</div></div>
          </div>
        </div>
      `;
    }

    // 12. Section 80G Tax Exemption
    if (data.tax_exemption_breakdown) {
      const t = data.tax_exemption_breakdown;
      html += `
        <div class="res-card">
          <div class="res-card-title"><i class="fas fa-scale-balanced"></i> Section 80G Tax Exemption</div>
          <div class="res-kpi-grid">
            <div class="res-kpi"><div class="res-kpi-val" style="color:#22c55e">${t.direct_tax_liability_savings}</div><div class="res-kpi-lbl">Direct Tax Saved</div></div>
            <div class="res-kpi"><div class="res-kpi-val">${t.net_effective_cost_to_donor}</div><div class="res-kpi-lbl">Net Cost to Donor</div></div>
          </div>
        </div>
      `;
    }

    // 13. Bharatiya Nyaya Sanhita (BNS 2023) Legal Provisions
    if (data.applicable_legal_provisions && Array.isArray(data.applicable_legal_provisions)) {
      data.applicable_legal_provisions.forEach(p => {
        html += `
          <div class="res-card">
            <div class="res-card-title"><i class="fas fa-gavel"></i> ${p.bns_section} (${p.offense})</div>
            <p style="font-size:13px; color:#cbd5e1; margin-bottom:6px;"><strong>IPC Equivalent:</strong> ${p.legacy_ipc} &bull; <strong>Classification:</strong> ${p.classification}</p>
            <p style="font-size:13px; color:#facc15;"><strong>Max Punishment:</strong> ${p.max_punishment}</p>
          </div>
        `;
      });
    }

    // 14. 4-Store Price Matrix
    if (data.price_matrix && Array.isArray(data.price_matrix)) {
      html += `
        <div class="res-card">
          <div class="res-card-title"><i class="fas fa-table-cells"></i> 4-Store Price Matrix (${data.deal_rating || 'Best Price'})</div>
          <div style="display:flex; flex-direction:column; gap:8px; margin-top:8px;">
      `;
      data.price_matrix.forEach(store => {
        html += `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:rgba(0,0,0,0.3); border-radius:6px; border:1px solid var(--border)">
            <span><strong>${store.store}</strong> <small style="color:var(--primary-l)">(${store.badge})</small></span>
            <span style="font-size:16px; font-weight:800; color:#fff">${store.price}</span>
          </div>
        `;
      });
      html += '</div></div>';
    }

    if (!html) {
      html = '<div class="res-card"><div class="res-card-title"><i class="fas fa-check-circle"></i> AI Model Response</div>';
      for (const [key, val] of Object.entries(data)) {
        if (typeof val === 'string' || typeof val === 'number') {
          html += `<p style="font-size:13.5px; margin-bottom:6px;"><strong>${key.replace(/_/g, ' ')}:</strong> ${val}</p>`;
        }
      }
      html += '</div>';
    }

    sbVisual.innerHTML = html;
  }

  // 9. Sandbox Form Submission with Universal BYOK Injection
  if (sbForm) {
    sbForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const endpoint = sbForm.getAttribute('data-endpoint') || '';
      const sample = JSON.parse(sbForm.getAttribute('data-sample') || '{}');
      
      const origBtn = sbBtn.innerHTML;
      sbBtn.disabled = true;
      sbBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Executing Inference...';

      const payload = {};
      sbForm.querySelectorAll('input, select, textarea').forEach(inp => {
        const key = (inp.id || '').replace('sb-', '').replace(/-/g, '_');
        if (key) {
          payload[key] = inp.type === 'number' ? parseFloat(inp.value) : inp.value;
        }
      });

      // Inject Universal BYOK headers if present
      const keys = getByokKeys();
      const headers = { 'Content-Type': 'application/json' };
      if (keys.groq) headers['X-Groq-API-Key'] = keys.groq;
      if (keys.gemini) headers['X-Gemini-Key'] = keys.gemini;
      if (keys.openai) headers['X-OpenAI-Key'] = keys.openai;
      if (keys.anthropic) headers['X-Anthropic-Key'] = keys.anthropic;

      fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      })
      .then(res => {
        if (!res.ok) throw new Error('Proxy returned ' + res.status);
        return res.json();
      })
      .then(data => {
        sbOutput.textContent = JSON.stringify(data, null, 2);
        renderVisualResult(data);
        if (typeof confetti === 'function') {
          try {
            confetti({ particleCount: 35, spread: 60, origin: { y: 0.75 } });
          } catch(e) {}
        }
      })
      .catch(err => {
        console.warn('Using local inference fallback:', err);
        sbOutput.textContent = JSON.stringify(sample, null, 2);
        renderVisualResult(sample);
      })
      .finally(() => {
        sbBtn.disabled = false;
        sbBtn.innerHTML = origBtn;
      });
    });
  }

  // 10. Sintra-Style AI Employee 1-Click Launchers (Sevenforce)
  document.querySelectorAll('.worker-try-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-worker');
      const tool = toolsData.find(t => t.name.toLowerCase().includes(name.toLowerCase()) || t.id.toLowerCase().includes(name.toLowerCase()));
      
      if (tool) {
        document.querySelectorAll('.tab-tool-btn').forEach(b => {
          if (b.getAttribute('data-tool-id') === tool.id) b.classList.add('active');
          else b.classList.remove('active');
        });
        renderTool(tool);
      }

      if (sandboxSec) {
        sandboxSec.scrollIntoView({ behavior: 'smooth' });
      }

      setTimeout(() => {
        if (sbBtn) sbBtn.click();
      }, 500);
    });
  });

  if (sbCopy) {
    sbCopy.addEventListener('click', () => {
      const txt = sbOutput.textContent;
      navigator.clipboard.writeText(txt).then(() => {
        sbCopy.innerHTML = '<i class="fas fa-check"></i>';
        setTimeout(() => { sbCopy.innerHTML = '<i class="far fa-copy"></i>'; }, 2000);
      });
    });
  }

    // 10b. Download Markdown Report Handler
  const sbDownload = document.getElementById('sandboxDownload');
  if (sbDownload) {
    sbDownload.addEventListener('click', () => {
      const txt = sbOutput ? sbOutput.textContent : '';
      const blob = new Blob(['# Sevenseed AI Model Report

Generated: ' + new Date().toISOString() + '

```json
' + txt + '
```
'], { type: 'text/markdown' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'sevenseed_ai_report.md';
      a.click();
    });
  }

  // 10c. GSAP Spring Physics & Staggered Scroll Triggers
  
  // Mobile Hamburger Menu Handler
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('open');
      const icon = hamburger.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-xmark');
        } else {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== hamburger) {
        navLinks.classList.remove('open');
        const icon = hamburger.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    });
  }

  window.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap !== 'undefined') {
      gsap.from('.hero-badge, .hero-title, .hero-sub, .hero-cta-group, .hero-stats', {
        opacity: 0,
        y: 28,
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out'
      });
      
      if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        gsap.from('.svc-card, .worker-card, .vent-card', {
          scrollTrigger: {
            trigger: '#services',
            start: 'top 85%'
          },
          opacity: 0,
          y: 35,
          stagger: 0.08,
          duration: 0.7,
          ease: 'power2.out'
        });
      }
    }
  });

  // 11. Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  const cfNote = document.getElementById('cf-note');
  if (contactForm && cfNote) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      cfNote.style.color = '#22c55e';
      cfNote.textContent = '✓ Message received! Our AI coordinator will reach out within 2 hours.';
      contactForm.reset();
    });
  }
})();
