/**
 * Lencomedicale LK - Admin Dashboard JavaScript
 * Handles data display, search, filter, status updates, notes, CSV export
 */

// ===== Data Access =====
const DB = {
    get(key) {
        try { return JSON.parse(localStorage.getItem(key)) || []; }
        catch { return []; }
    },
    set(key, data) { localStorage.setItem(key, JSON.stringify(data)); },
    update(key, id, updates) {
        const data = this.get(key);
        const idx = data.findIndex(d => d.id === id);
        if (idx !== -1) { Object.assign(data[idx], updates); this.set(key, data); }
    }
};

// ===== Tab Navigation =====
document.querySelectorAll('.sidebar-nav a[data-tab]').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const tab = this.dataset.tab;
        document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
        document.getElementById('tab-' + tab).classList.add('active');
    });
});

// ===== Render Stats =====
function updateStats() {
    const doctors = DB.get('doctor_submissions');
    const centres = DB.get('centre_enquiries');
    document.getElementById('statTotal').textContent = doctors.length;
    document.getElementById('statNew').textContent = doctors.filter(d => d.status === 'new').length;
    document.getElementById('statShortlisted').textContent = doctors.filter(d => d.status === 'shortlisted').length;
    document.getElementById('statCentres').textContent = centres.length;
}

// ===== Render Doctor Submissions Table =====
function renderDoctors(filter = 'all', search = '') {
    let doctors = DB.get('doctor_submissions');

    // Filter by status
    if (filter !== 'all') {
        doctors = doctors.filter(d => d.status === filter);
    }

    // Search
    if (search) {
        const s = search.toLowerCase();
        doctors = doctors.filter(d =>
            (d.fullName || '').toLowerCase().includes(s) ||
            (d.specialty || '').toLowerCase().includes(s) ||
            (d.email || '').toLowerCase().includes(s) ||
            (d.currentCountry || '').toLowerCase().includes(s) ||
            (d.registrationStatus || '').toLowerCase().includes(s)
        );
    }

    const container = document.getElementById('doctorsTableBody');

    if (doctors.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No submissions match your criteria.</p></div>';
        return;
    }

    let html = `<table><thead><tr>
        <th>Name</th><th>Specialty</th><th>Country</th><th>Registration</th><th>Status</th><th>Date</th><th>Actions</th>
    </tr></thead><tbody>`;

    doctors.forEach(d => {
        const date = new Date(d.submittedAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
        html += `<tr>
            <td><span class="td-name">${d.fullName || '—'}</span><br><span class="td-email">${d.email || ''}</span></td>
            <td>${d.specialty || '—'}</td>
            <td>${d.currentCountry || '—'}</td>
            <td>${formatRegistration(d.registrationStatus)}</td>
            <td>${statusBadge(d.status)}</td>
            <td>${date}</td>
            <td><button class="btn btn-sm" onclick="viewDoctor('${d.id}')"><i class="fas fa-eye"></i> View</button></td>
        </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;

    // Populate specialty filter
    const allDoctors = DB.get('doctor_submissions');
    const specialties = [...new Set(allDoctors.map(d => d.specialty).filter(Boolean))];
    const filterEl = document.getElementById('filterSpecialty');
    if (filterEl) {
        filterEl.innerHTML = '<option value="all">All Specialties</option>';
        specialties.forEach(s => {
            filterEl.innerHTML += `<option value="${s}">${s}</option>`;
        });
    }
}

// ===== Render Centre Enquiries =====
function renderCentres(search = '') {
    let centres = DB.get('centre_enquiries');

    if (search) {
        const s = search.toLowerCase();
        centres = centres.filter(c =>
            (c.centreName || '').toLowerCase().includes(s) ||
            (c.contactPerson || '').toLowerCase().includes(s) ||
            (c.doctorType || '').toLowerCase().includes(s)
        );
    }

    const container = document.getElementById('centresTableBody');

    if (centres.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-hospital"></i><p>No centre enquiries yet.</p></div>';
        return;
    }

    let html = `<table><thead><tr>
        <th>Centre Name</th><th>Contact</th><th>Type</th><th>Doctor Needed</th><th>Role</th><th>Date</th><th>Actions</th>
    </tr></thead><tbody>`;

    centres.forEach(c => {
        const date = new Date(c.submittedAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
        html += `<tr>
            <td><span class="td-name">${c.centreName || '—'}</span><br><span class="td-email">${c.email || ''}</span></td>
            <td>${c.contactPerson || '—'}</td>
            <td>${c.centreType || '—'}</td>
            <td>${c.doctorType || '—'}</td>
            <td>${c.roleType || '—'}</td>
            <td>${date}</td>
            <td><button class="btn btn-sm" onclick="viewCentre('${c.id}')"><i class="fas fa-eye"></i> View</button></td>
        </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ===== Render Contact Messages =====
function renderContacts() {
    const messages = DB.get('contact_messages');
    const container = document.getElementById('contactsTableBody');

    if (messages.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-envelope-open"></i><p>No contact messages yet.</p></div>';
        return;
    }

    let html = `<table><thead><tr>
        <th>Name</th><th>Email</th><th>Role</th><th>Subject</th><th>Date</th>
    </tr></thead><tbody>`;

    messages.forEach(m => {
        const date = new Date(m.submittedAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
        html += `<tr>
            <td class="td-name">${m.name || '—'}</td>
            <td>${m.email || '—'}</td>
            <td>${m.role || '—'}</td>
            <td>${m.subject || '—'}</td>
            <td>${date}</td>
        </tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ===== View Doctor Detail =====
function viewDoctor(id) {
    const doctors = DB.get('doctor_submissions');
    const d = doctors.find(doc => doc.id === id);
    if (!d) return;

    document.getElementById('modalTitle').textContent = d.fullName || 'Doctor Details';

    let html = `<div class="modal-grid">
        <div class="modal-field"><label>Full Name</label><p>${d.fullName || '—'}</p></div>
        <div class="modal-field"><label>Email</label><p>${d.email || '—'}</p></div>
        <div class="modal-field"><label>Phone</label><p>${d.phone || '—'}</p></div>
        <div class="modal-field"><label>Country</label><p>${d.currentCountry || '—'}</p></div>
        <div class="modal-field"><label>In Australia</label><p>${d.inAustralia || '—'}</p></div>
        <div class="modal-field"><label>LinkedIn</label><p>${d.linkedin ? '<a href="'+d.linkedin+'" target="_blank" style="color:var(--teal)">'+d.linkedin+'</a>' : '—'}</p></div>
    </div>
    <hr style="border:none;border-top:1px solid var(--gray-200);margin:1.5rem 0;">
    <div class="modal-grid">
        <div class="modal-field"><label>Qualification</label><p>${d.qualification || '—'}</p></div>
        <div class="modal-field"><label>Country of Qualification</label><p>${d.qualificationCountry || '—'}</p></div>
        <div class="modal-field"><label>Year of Graduation</label><p>${d.graduationYear || '—'}</p></div>
        <div class="modal-field"><label>Current Role</label><p>${d.currentRole || '—'}</p></div>
        <div class="modal-field"><label>Specialty</label><p>${d.specialty || '—'}</p></div>
        <div class="modal-field"><label>Experience</label><p>${d.experience || '—'}</p></div>
        <div class="modal-field"><label>Preferred Role Type</label><p>${d.roleType || '—'}</p></div>
        <div class="modal-field"><label>Registration Status</label><p>${formatRegistration(d.registrationStatus)}</p></div>
        <div class="modal-field"><label>English Test</label><p>${d.englishTest || '—'}</p></div>
        <div class="modal-field"><label>Visa Status</label><p>${d.visaStatus || '—'}</p></div>
        <div class="modal-field"><label>Availability</label><p>${d.availability || '—'}</p></div>
        <div class="modal-field"><label>CV File</label><p>${d.cvFile || '—'}</p></div>
    </div>
    <hr style="border:none;border-top:1px solid var(--gray-200);margin:1.5rem 0;">
    <div class="modal-grid">
        <div class="modal-field">
            <label>Status</label>
            <select class="status-select" id="modalStatus" data-id="${d.id}">
                <option value="new" ${d.status==='new'?'selected':''}>New</option>
                <option value="reviewed" ${d.status==='reviewed'?'selected':''}>Reviewed</option>
                <option value="shortlisted" ${d.status==='shortlisted'?'selected':''}>Shortlisted</option>
                <option value="sent" ${d.status==='sent'?'selected':''}>Sent to Medical Centre</option>
                <option value="contacted" ${d.status==='contacted'?'selected':''}>Contacted</option>
                <option value="not-suitable" ${d.status==='not-suitable'?'selected':''}>Not Suitable</option>
            </select>
        </div>
        <div class="modal-field">
            <label>Submitted</label>
            <p>${new Date(d.submittedAt).toLocaleString('en-AU')}</p>
        </div>
    </div>
    <div class="modal-field" style="margin-top:1rem;">
        <label>Private Notes</label>
        <textarea class="notes-area" id="modalNotes" data-id="${d.id}" placeholder="Add private notes about this candidate...">${d.notes || ''}</textarea>
    </div>
    <div style="margin-top:1.5rem;display:flex;gap:0.75rem;">
        <button class="btn btn-primary" onclick="saveDoctor('${d.id}')"><i class="fas fa-save"></i> Save Changes</button>
        <button class="btn btn-danger" onclick="deleteDoctor('${d.id}')"><i class="fas fa-trash"></i> Delete</button>
    </div>`;

    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('detailModal').classList.add('show');
}

// ===== View Centre Detail =====
function viewCentre(id) {
    const centres = DB.get('centre_enquiries');
    const c = centres.find(x => x.id === id);
    if (!c) return;

    document.getElementById('modalTitle').textContent = c.centreName || 'Centre Details';

    let html = `<div class="modal-grid">
        <div class="modal-field"><label>Centre Name</label><p>${c.centreName || '—'}</p></div>
        <div class="modal-field"><label>Contact Person</label><p>${c.contactPerson || '—'}</p></div>
        <div class="modal-field"><label>Email</label><p>${c.email || '—'}</p></div>
        <div class="modal-field"><label>Phone</label><p>${c.phone || '—'}</p></div>
        <div class="modal-field"><label>Centre Type</label><p>${c.centreType || '—'}</p></div>
        <div class="modal-field"><label>Doctor Needed</label><p>${c.doctorType || '—'}</p></div>
        <div class="modal-field"><label>Role Type</label><p>${c.roleType || '—'}</p></div>
        <div class="modal-field"><label>Urgency</label><p>${c.urgency || '—'}</p></div>
    </div>
    <div class="modal-field" style="margin-top:1rem;">
        <label>Message</label>
        <p>${c.message || '—'}</p>
    </div>
    <div class="modal-field" style="margin-top:1rem;">
        <label>Submitted</label>
        <p>${new Date(c.submittedAt).toLocaleString('en-AU')}</p>
    </div>`;

    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('detailModal').classList.add('show');
}

// ===== Save Doctor Updates =====
function saveDoctor(id) {
    const status = document.getElementById('modalStatus').value;
    const notes = document.getElementById('modalNotes').value;
    DB.update('doctor_submissions', id, { status, notes });
    closeModal();
    renderAll();
}

// ===== Delete Doctor =====
function deleteDoctor(id) {
    if (!confirm('Are you sure you want to delete this submission? This cannot be undone.')) return;
    const data = DB.get('doctor_submissions').filter(d => d.id !== id);
    DB.set('doctor_submissions', data);
    closeModal();
    renderAll();
}

// ===== Close Modal =====
function closeModal() {
    document.getElementById('detailModal').classList.remove('show');
}
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('detailModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

// ===== Status Badge Helper =====
function statusBadge(status) {
    const map = {
        'new': 'badge-new',
        'reviewed': 'badge-reviewed',
        'shortlisted': 'badge-shortlisted',
        'sent': 'badge-sent',
        'contacted': 'badge-contacted',
        'not-suitable': 'badge-not-suitable'
    };
    const labels = {
        'new': 'New',
        'reviewed': 'Reviewed',
        'shortlisted': 'Shortlisted',
        'sent': 'Sent to Centre',
        'contacted': 'Contacted',
        'not-suitable': 'Not Suitable'
    };
    return `<span class="badge ${map[status] || 'badge-new'}">${labels[status] || status}</span>`;
}

function formatRegistration(val) {
    const map = {
        'ahpra-registered': 'AHPRA Registered',
        'amc-started': 'AMC Started',
        'amc-completed': 'AMC Completed',
        'specialist-pathway': 'Specialist Pathway',
        'not-started': 'Not Started',
        'not-sure': 'Not Sure'
    };
    return map[val] || val || '—';
}

// ===== CSV Export =====
document.getElementById('exportCsvBtn').addEventListener('click', function() {
    const doctors = DB.get('doctor_submissions');
    if (doctors.length === 0) { alert('No data to export.'); return; }

    const headers = ['Full Name','Email','Phone','Country','In Australia','Qualification','Country of Qualification','Year','Current Role','Specialty','Experience','Role Type','Registration','English Test','Visa','Availability','Status','Notes','Submitted'];
    const rows = doctors.map(d => [
        d.fullName, d.email, d.phone, d.currentCountry, d.inAustralia,
        d.qualification, d.qualificationCountry, d.graduationYear, d.currentRole,
        d.specialty, d.experience, d.roleType, d.registrationStatus,
        d.englishTest, d.visaStatus, d.availability, d.status, d.notes, d.submittedAt
    ]);

    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${(cell || '').replace(/"/g, '""')}"`).join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doctor_submissions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
});

// ===== Search & Filter Events =====
document.getElementById('searchDoctors').addEventListener('input', function() {
    const status = document.getElementById('filterStatus').value;
    renderDoctors(status, this.value);
});
document.getElementById('filterStatus').addEventListener('change', function() {
    const search = document.getElementById('searchDoctors').value;
    renderDoctors(this.value, search);
});
document.getElementById('filterSpecialty').addEventListener('change', function() {
    // Re-render with specialty filter combined
    let doctors = DB.get('doctor_submissions');
    const status = document.getElementById('filterStatus').value;
    const search = document.getElementById('searchDoctors').value;
    if (this.value !== 'all') {
        // Custom filter for specialty
        const specialty = this.value;
        const container = document.getElementById('doctorsTableBody');
        let filtered = doctors;
        if (status !== 'all') filtered = filtered.filter(d => d.status === status);
        if (search) {
            const s = search.toLowerCase();
            filtered = filtered.filter(d => (d.fullName||'').toLowerCase().includes(s) || (d.specialty||'').toLowerCase().includes(s));
        }
        filtered = filtered.filter(d => d.specialty === specialty);
        // Re-render with specialty
        renderDoctorsFiltered(filtered);
    } else {
        renderDoctors(document.getElementById('filterStatus').value, document.getElementById('searchDoctors').value);
    }
});

function renderDoctorsFiltered(doctors) {
    const container = document.getElementById('doctorsTableBody');
    if (doctors.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><p>No submissions match your criteria.</p></div>';
        return;
    }
    let html = `<table><thead><tr><th>Name</th><th>Specialty</th><th>Country</th><th>Registration</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead><tbody>`;
    doctors.forEach(d => {
        const date = new Date(d.submittedAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
        html += `<tr><td><span class="td-name">${d.fullName||'—'}</span><br><span class="td-email">${d.email||''}</span></td><td>${d.specialty||'—'}</td><td>${d.currentCountry||'—'}</td><td>${formatRegistration(d.registrationStatus)}</td><td>${statusBadge(d.status)}</td><td>${date}</td><td><button class="btn btn-sm" onclick="viewDoctor('${d.id}')"><i class="fas fa-eye"></i> View</button></td></tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

document.getElementById('searchCentres').addEventListener('input', function() {
    renderCentres(this.value);
});

// ===== Render All =====
function renderAll() {
    updateStats();
    renderDoctors();
    renderCentres();
    renderContacts();
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', renderAll);
