(function () {
  'use strict';

  /* =========================================================
   * DOM REFS
   * ========================================================= */
  const form          = document.getElementById('reportForm');
  const btnGenerate   = document.getElementById('btnGenerate');
  const resultPanel   = document.getElementById('resultPanel');
  const reportOutput  = document.getElementById('reportOutput');
  const btnCopy       = document.getElementById('btnCopy');
  const copyLabel     = document.getElementById('copyLabel');
  const copyToast     = document.getElementById('copyToast');
  const btnNewReport  = document.getElementById('btnNewReport');

  const fields = {
    jenis:       document.getElementById('jenis'),
    jumlah:      document.getElementById('jumlah'),
    nama:        document.getElementById('nama'),
    alamat:      document.getElementById('alamat'),
    tanggal:     document.getElementById('tanggal'),
    verifikator: document.getElementById('verifikator'),
    jabatan:     document.getElementById('jabatan'),
  };

  const errEls = {
    jenis:       document.getElementById('err-jenis'),
    jumlah:      document.getElementById('err-jumlah'),
    nama:        document.getElementById('err-nama'),
    alamat:      document.getElementById('err-alamat'),
    tanggal:     document.getElementById('err-tanggal'),
    verifikator: document.getElementById('err-verifikator'),
  };

  /* =========================================================
   * HELPERS
   * ========================================================= */

  /** Indonesian day & month names */
  const DAYS = [
    'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu',
  ];
  const MONTHS = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
  ];

  /** Format YYYY-MM-DD → "Rabu, 10 Juni 2026" */
  function formatDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
    return `${DAYS[date.getDay()]}, ${parseInt(d, 10)} ${MONTHS[parseInt(m, 10) - 1]} ${y}`;
  }

  /** Strip non-digit chars, return raw number string */
  function rawNumber(val) {
    return val.replace(/\D/g, '');
  }

  /** "500000" → "500.000" (Indonesia thousands separator) */
  function formatRupiah(display) {
    const digits = rawNumber(display);
    if (!digits) return '';
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  /** Validate a single field, show/hide error */
  function validateField(name) {
    const el = fields[name];
    const err = errEls[name];
    if (!err) return true; // jabatan has no error el — optional field

    const valid = el.value.trim() !== '' && el.value !== 'Pilih jenis bantuan...';
    if (valid) {
      el.classList.remove('border-red-400', 'bg-red-50');
      el.classList.add('border-stone-300', 'bg-stone-50');
      err.classList.add('hidden');
    } else {
      el.classList.remove('border-stone-300', 'bg-stone-50');
      el.classList.add('border-red-400', 'bg-red-50');
      err.classList.remove('hidden');
    }
    return valid;
  }

  /** Validate all required fields, return true if all pass */
  function validateAll() {
    let allValid = true;
    ['jenis', 'jumlah', 'nama', 'alamat', 'tanggal', 'verifikator'].forEach(function (name) {
      if (!validateField(name)) allValid = false;
    });
    return allValid;
  }

  /** Show error state on all empty fields (for first-time submit) */
  function showAllErrors() {
    ['jenis', 'jumlah', 'nama', 'alamat', 'tanggal', 'verifikator'].forEach(validateField);
  }

  /* =========================================================
   * RUPIAH INPUT FORMATTING
   * ========================================================= */
  fields.jumlah.addEventListener('input', function () {
    const raw = rawNumber(this.value);
    if (raw === '') {
      this.value = '';
      return;
    }
    // Store raw value in data attr, show formatted
    this.dataset.raw = raw;
    this.value = formatRupiah(raw);
    // Live-validate
    if (this.classList.contains('border-red-400')) {
      validateField('jumlah');
    }
  });

  /* =========================================================
   * DATE DEFAULTS
   * ========================================================= */
  // Set today's date as default
  (function setDefaultDate() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    fields.tanggal.value = y + '-' + m + '-' + d;
  })();

  /* =========================================================
   * LIVE VALIDATION ON BLUR
   * ========================================================= */
  ['jenis', 'jumlah', 'nama', 'alamat', 'tanggal', 'verifikator'].forEach(function (name) {
    const el = fields[name];
    el.addEventListener('blur', function () {
      validateField(name);
    });
    el.addEventListener('input', function () {
      // Clear error as user types
      if (el.value.trim() !== '' && el.classList.contains('border-red-400')) {
        validateField(name);
      }
    });
    el.addEventListener('change', function () {
      if (el.value.trim() !== '') validateField(name);
    });
  });

  /* =========================================================
   * GENERATE REPORT
   * ========================================================= */

  /** Build the template string from form values */
  function buildReport(data) {
    var lines = [
      'Penyerahan bantuan',
      '📝 LAPORAN PENYERAHAN BANTUAN',
      '',
      '🗒Jenis Bantuan : ' + data.jenis,
      '',
      '💰 Jumlah : Rp. ' + data.jumlah + ',-',
      '',
      '👤 Penerima : ' + data.nama,
      '',
      '🏡 Alamat : ' + data.alamat,
      '',
      '📆 Tanggal Penyerahan : ' + data.tanggal,
      '',
      '👤 Yang menyerahkan :',
      data.verifikator,
      data.jabatan || '',
    ];
    return lines.join('\n');
  }

  function generateReport() {
    if (!validateAll()) {
      showAllErrors();
      // Focus first invalid field
      const firstErr = document.querySelector('.border-red-400');
      if (firstErr) firstErr.focus();
      return;
    }

    // Collect raw number from data attribute or input
    const jumlahRaw = fields.jumlah.dataset.raw || rawNumber(fields.jumlah.value);

    const data = {
      jenis:       fields.jenis.value,
      jumlah:      formatRupiah(jumlahRaw),
      nama:        fields.nama.value.trim(),
      alamat:      fields.alamat.value.trim(),
      tanggal:     formatDate(fields.tanggal.value),
      verifikator: fields.verifikator.value.trim(),
      jabatan:     fields.jabatan.value.trim(),
    };

    const report = buildReport(data);
    reportOutput.textContent = report;

    // Show result panel with animation
    resultPanel.classList.remove('hidden');
    resultPanel.classList.add('result-enter');
    requestAnimationFrame(function () {
      resultPanel.classList.add('result-enter-active');
    });

    // Scroll to result on mobile
    setTimeout(function () {
      resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    // Reset copy button state
    copyLabel.textContent = 'Salin';
    btnCopy.disabled = false;
    copyToast.classList.add('hidden');
  }

  /* =========================================================
   * COPY TO CLIPBOARD
   * ========================================================= */
  async function copyReport() {
    const text = reportOutput.textContent;
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      copyLabel.textContent = 'Tersalin!';
      btnCopy.disabled = true;
      copyToast.classList.remove('hidden');
      setTimeout(function () {
        copyToast.classList.add('hidden');
      }, 2500);
    } catch (_err) {
      // Fallback for older browsers / non-HTTPS
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        copyLabel.textContent = 'Tersalin!';
        btnCopy.disabled = true;
        copyToast.classList.remove('hidden');
        setTimeout(function () {
          copyToast.classList.add('hidden');
        }, 2500);
      } catch (_e2) {
        copyLabel.textContent = 'Gagal salin';
        setTimeout(function () {
          copyLabel.textContent = 'Salin';
        }, 2000);
      }
    }
  }

  /* =========================================================
   * NEW REPORT (reset form)
   * ========================================================= */
  function resetForm() {
    form.reset();
    // Reset Rupiah field
    fields.jumlah.value = '';
    delete fields.jumlah.dataset.raw;
    // Reset date to today
    (function setDefaultDate() {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, '0');
      const d = String(now.getDate()).padStart(2, '0');
      fields.tanggal.value = y + '-' + m + '-' + d;
    })();
    // Clear all error states
    ['jenis', 'jumlah', 'nama', 'alamat', 'tanggal', 'verifikator'].forEach(function (name) {
      const el = fields[name];
      el.classList.remove('border-red-400', 'bg-red-50');
      el.classList.add('border-stone-300', 'bg-stone-50');
      if (errEls[name]) errEls[name].classList.add('hidden');
    });
    // Hide result panel
    resultPanel.classList.add('hidden');
    resultPanel.classList.remove('result-enter', 'result-enter-active');
    reportOutput.textContent = '';
    copyLabel.textContent = 'Salin';
    btnCopy.disabled = false;
    copyToast.classList.add('hidden');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* =========================================================
   * EVENT BINDING
   * ========================================================= */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    generateReport();
  });

  btnCopy.addEventListener('click', copyReport);

  btnNewReport.addEventListener('click', resetForm);

})();
