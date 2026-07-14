import React, { useState } from 'react';
import { ShieldCheck, MessageSquareWarning, HelpCircle, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

export default function SmsGuide() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-blue-950 border border-blue-800 rounded-3xl shadow-lg overflow-hidden transition-all duration-300 text-left mb-8">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-800/50 rounded-2xl text-blue-300 border border-blue-700/50">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-xl md:text-2xl tracking-tight">
              Master Guide: How to Read SMS Sender IDs
            </h3>
            <p className="text-blue-200/80 text-sm mt-1">
              Learn how to spot real vs fake messages instantly in India
            </p>
          </div>
        </div>
        <div className="bg-blue-800/50 p-2 rounded-full">
          {expanded ? (
            <ChevronUp className="w-6 h-6 text-blue-300" />
          ) : (
            <ChevronDown className="w-6 h-6 text-blue-300" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 pb-8 md:px-8 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 animate-fade-in text-slate-800 dark:text-slate-200">
          
          <div className="pt-6 space-y-8">
            
            {/* The Format */}
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                1. The Standard Format
              </h4>
              <p className="text-sm md:text-base leading-relaxed">
                In India, official SMS sender IDs generally follow this format: 
                <span className="inline-block mx-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold text-blue-600 dark:text-blue-400">
                  XX-CompanyCode-X
                </span>
              </p>
              
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold">Part</th>
                      <th className="px-4 py-3 text-left font-bold">Meaning</th>
                      <th className="px-4 py-3 text-left font-bold">Example</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    <tr>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-600 dark:text-slate-300">JG / BT / CP</td>
                      <td className="px-4 py-3 leading-relaxed">Telecom operator & circle (routing code). Tells you which network delivered it.</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded font-mono text-xs">JG</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-600 dark:text-slate-300">DOTGUJ / INDBNK</td>
                      <td className="px-4 py-3 leading-relaxed">Registered sender name (company or organization).</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded font-mono text-xs">INDBNK</span></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-mono font-semibold text-slate-600 dark:text-slate-300">-G, -S, -P</td>
                      <td className="px-4 py-3 leading-relaxed">Type of message (Government, Service, Promotional).</td>
                      <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-200 dark:bg-slate-800 rounded font-mono text-xs">-S</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Message Types */}
            <div className="space-y-4">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                2. Meaning of the Last Letter
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <span className="font-mono font-bold text-xl text-blue-600 dark:text-blue-400 block mb-2">-G = Government</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Messages from government departments.</p>
                  <p className="text-xs font-semibold text-slate-500">Ex: DOT, UIDAI, Election Commission.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-2xl border border-green-100 dark:border-green-900/30">
                  <span className="font-mono font-bold text-xl text-green-600 dark:text-green-400 block mb-2">-S = Service</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Transaction alerts, OTPs, bank alerts, order updates.</p>
                  <p className="text-xs font-semibold text-slate-500">Ex: BT-INDBNK-S (Indian Bank alert)</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/30">
                  <span className="font-mono font-bold text-xl text-amber-600 dark:text-amber-400 block mb-2">-P = Promotional</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Advertisements, offers, discounts, loans.</p>
                  <p className="text-xs font-semibold text-slate-500">Ex: Shopping offers, sale alerts.</p>
                </div>
              </div>
            </div>

            {/* Real vs Fake */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              
              {/* Genuine */}
              <div className="bg-green-50/50 dark:bg-green-950/10 p-5 md:p-6 rounded-3xl border border-green-200 dark:border-green-900/40 space-y-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                  <h4 className="font-bold text-lg text-green-800 dark:text-green-400">Genuine Bank SMS</h4>
                </div>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex gap-2 items-start"><span className="text-green-500 font-bold">✓</span> Sent from a registered ID (AX-ICICIB, BT-INDBNK)</li>
                  <li className="flex gap-2 items-start"><span className="text-green-500 font-bold">✓</span> Mentions account number (partially hidden)</li>
                  <li className="flex gap-2 items-start"><span className="text-green-500 font-bold">✓</span> Shows exact amount, date, time & reference</li>
                  <li className="flex gap-2 items-start"><span className="text-green-500 font-bold">✓</span> NEVER asks for OTP, PIN, CVV, or Password</li>
                </ul>
                <div className="mt-4 p-3 bg-white dark:bg-slate-900 border border-green-100 dark:border-green-900/30 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Example</span>
                  <p className="text-sm font-medium">A/c **9035 debited Rs.40.00 on 13-Jul-26 via UPI. If not done by you, contact customer care.</p>
                </div>
              </div>

              {/* Scam */}
              <div className="bg-red-50/50 dark:bg-red-950/10 p-5 md:p-6 rounded-3xl border border-red-200 dark:border-red-900/40 space-y-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <h4 className="font-bold text-lg text-red-800 dark:text-red-400">Scam SMS</h4>
                </div>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex gap-2 items-start"><span className="text-red-500 font-bold">✗</span> Says "Your account will be blocked."</li>
                  <li className="flex gap-2 items-start"><span className="text-red-500 font-bold">✗</span> Asks you to click a suspicious link.</li>
                  <li className="flex gap-2 items-start"><span className="text-red-500 font-bold">✗</span> Uses spelling mistakes or poor English.</li>
                  <li className="flex gap-2 items-start"><span className="text-red-500 font-bold">✗</span> Comes from an unknown personal 10-digit mobile number.</li>
                </ul>
                <div className="mt-4 p-3 bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Example</span>
                  <p className="text-sm font-medium">Dear Customer, your bank account is blocked. Click abc-bank-update.xyz to verify immediately.</p>
                </div>
              </div>

            </div>

            {/* Golden Rule */}
            <div className="bg-slate-900 dark:bg-slate-950 p-6 rounded-2xl text-center shadow-md border border-slate-800">
              <span className="text-amber-400 font-black tracking-widest uppercase text-xs mb-2 block">Golden Rule</span>
              <p className="text-white font-medium text-sm sm:text-base leading-relaxed">
                A real bank will <span className="text-red-400 font-bold underline decoration-red-400/50 decoration-2 underline-offset-4">never</span> ask you for your OTP, UPI PIN, ATM PIN, CVV, or password through SMS or a phone call.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
