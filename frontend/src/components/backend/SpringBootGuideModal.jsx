import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Server,
  Code2,
  ShieldCheck,
  Key,
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers,
} from 'lucide-react';

export const SpringBootGuideModal = ({ isOpen, onClose }) => {
  const { apiUrl, setApiUrl } = useAuth();
  const { success } = useToast();

  const [inputUrl, setInputUrl] = useState(apiUrl);
  const [activeTab, setActiveTab] = useState('endpoints');

  const handleSaveUrl = () => {
    setApiUrl(inputUrl);
    success(`Spring Boot API Base URL updated to: ${inputUrl}`);
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    success(`${label} copied to clipboard!`);
  };

  const sampleSecuritySnippet = `@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}`;

  const endpoints = [
    { method: 'POST', path: '/api/v1/auth/login', desc: 'Authenticates user and issues JWT Access & Refresh token' },
    { method: 'POST', path: '/api/v1/auth/register', desc: 'Registers new user with role ROLE_USER or ROLE_ADMIN' },
    { method: 'GET', path: '/api/v1/incomes', desc: 'Get all incomes for current authenticated user' },
    { method: 'POST', path: '/api/v1/incomes', desc: 'Create new income record (source, amount, date, ref)' },
    { method: 'PUT', path: '/api/v1/incomes/{id}', desc: 'Update income record by ID' },
    { method: 'DELETE', path: '/api/v1/incomes/{id}', desc: 'Delete income record by ID' },
    { method: 'GET', path: '/api/v1/expenses', desc: 'Get all expenses for current authenticated user' },
    { method: 'POST', path: '/api/v1/expenses', desc: 'Log new expense (category, amount, date, method, desc)' },
    { method: 'PUT', path: '/api/v1/expenses/{id}', desc: 'Update expense record by ID' },
    { method: 'DELETE', path: '/api/v1/expenses/{id}', desc: 'Delete expense record by ID' },
    { method: 'GET', path: '/api/v1/budgets', desc: 'Get monthly budget spending limits per category' },
    { method: 'POST', path: '/api/v1/budgets', desc: 'Set or update monthly category budget cap' },
    { method: 'DELETE', path: '/api/v1/budgets/{id}', desc: 'Remove budget limit for a category' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Spring Boot & JWT Backend Integration Spec"
      maxWidth="max-w-3xl"
    >
      <div className="space-y-5">
        {/* Connection Switcher */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-indigo-600" />
                <span>Backend Connection Settings</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Point this frontend directly to your running Spring Boot server.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="http://localhost:8080/api/v1"
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-indigo-500 w-56"
              />
              <button
                onClick={handleSaveUrl}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`pb-2 px-3 border-b-2 transition ${
              activeTab === 'endpoints'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            REST Endpoints Spec
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-2 px-3 border-b-2 transition ${
              activeTab === 'security'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Spring Security + JWT Config
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'endpoints' && (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            <div className="text-xs text-slate-500 mb-2">
              All endpoints except <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">/auth/**</code> expect header{' '}
              <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">Authorization: Bearer &lt;token&gt;</code>.
            </div>
            {endpoints.map((ep, idx) => (
              <div
                key={idx}
                className="flex items-start sm:items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs gap-3"
              >
                <div className="flex items-center gap-2 font-mono">
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      ep.method === 'GET'
                        ? 'bg-blue-100 text-blue-700'
                        : ep.method === 'POST'
                        ? 'bg-emerald-100 text-emerald-700'
                        : ep.method === 'PUT'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {ep.method}
                  </span>
                  <span className="font-semibold text-slate-800">{ep.path}</span>
                </div>
                <span className="text-slate-500 text-[11px] text-right">{ep.desc}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">SecurityFilterChain (Java 17 / Spring Boot 3):</span>
              <button
                onClick={() => copyToClipboard(sampleSecuritySnippet, 'Spring Security config')}
                className="flex items-center gap-1 text-[11px] text-indigo-600 font-semibold hover:underline"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Java Code</span>
              </button>
            </div>
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed max-h-72">
              {sampleSecuritySnippet}
            </pre>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </Modal>
  );
};
