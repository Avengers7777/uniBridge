const Footer = () => {
  return <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 text-xs text-slate-500 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <span className="text-sm font-bold text-slate-900 dark:text-white">NexusCollab</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Enterprise AI-guided academia-industry collaboration, verified skill-gap diagnostics, and institutional placement orchestration.
            </p>
          </div>

          <div>
            <span className="font-semibold text-slate-900 dark:text-white block mb-2.5">Stakeholder Portals</span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Student Placement Hub</li>
              <li>University TPO Placement Cell</li>
              <li>Corporate Recruiter Console</li>
              <li>Consortium Governance & Audit</li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-slate-900 dark:text-white block mb-2.5">Governance & Standards</span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>Institutional Accreditation Alignment</li>
              <li>Verified Academic Credentials</li>
              <li>Corporate MoU Standardization</li>
              <li>Zero-Trust Data Protection</li>
            </ul>
          </div>

          <div>
            <span className="font-semibold text-slate-900 dark:text-white block mb-2.5">Accessibility & Inclusivity</span>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400">
              <li>WCAG 2.1 AAA High-Contrast Certified</li>
              <li>Full Screen-Reader Navigable</li>
              <li>Scalable Display Sizing</li>
              <li>Keyboard Interactive Navigation</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© 2026 NexusCollab Consortium. All institutional rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Academic Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Security Framework</span>
            <span aria-hidden="true">·</span>
            <span>Accessibility Conformance</span>
          </div>
        </div>
      </div>
    </footer>;
};
export {
  Footer
};
