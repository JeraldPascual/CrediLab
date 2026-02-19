import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function VerifyCertPage() {
  const { hash } = useParams();
  const [status, setStatus] = useState("loading"); // loading | valid | invalid
  const [cert, setCert] = useState(null);

  useEffect(() => {
    async function verify() {
      if (!hash) { setStatus("invalid"); return; }
      try {
        const snap = await getDoc(doc(db, "certificates", hash));
        if (snap.exists()) {
          setCert(snap.data());
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("invalid");
      }
    }
    verify();
  }, [hash]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <span className="text-2xl font-bold text-green-600">CrediLab</span>
        <p className="text-sm text-gray-400 mt-0.5">Certificate Verification</p>
      </div>

      {status === "loading" && (
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          Verifying certificate…
        </div>
      )}

      {status === "valid" && cert && (
        <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {/* Green top bar */}
          <div className="h-2 bg-gradient-to-r from-green-400 to-green-600" />

          <div className="p-8 space-y-6 text-center">
            <CheckCircleIcon className="w-14 h-14 text-green-500 mx-auto" />

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                Verified Certificate
              </p>
              <h1 className="text-2xl font-bold text-gray-900">{cert.studentName}</h1>
              <p className="text-sm text-gray-500 mt-1">
                has earned the rank of
              </p>
              <p className="text-xl font-bold text-green-600 mt-1">{cert.tierTitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-2xl font-bold text-green-600">{cert.credits}</p>
                <p className="text-xs text-gray-400 mt-0.5">CLB Earned</p>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-2xl font-bold text-green-600">{cert.completedCount}</p>
                <p className="text-xs text-gray-400 mt-0.5">Challenges Solved</p>
              </div>
            </div>

            <div className="text-xs text-gray-400 space-y-1 pt-2 border-t border-gray-100">
              <p>Issued: <span className="font-medium text-gray-600">{cert.issueDate}</span></p>
              <p>Certificate ID: <span className="font-mono text-gray-500">{hash.slice(0, 16)}…</span></p>
              <p className="text-green-600 font-semibold">✓ Issued by CrediLab Platform</p>
            </div>
          </div>
        </div>
      )}

      {status === "invalid" && (
        <div className="w-full max-w-lg bg-white rounded-2xl border border-red-200 shadow-lg p-8 text-center space-y-4">
          <XCircleIcon className="w-14 h-14 text-red-400 mx-auto" />
          <h1 className="text-xl font-bold text-gray-900">Certificate Not Found</h1>
          <p className="text-sm text-gray-500">
            This certificate ID is invalid or has not been issued by CrediLab.
            If you believe this is an error, contact your administrator.
          </p>
          <p className="font-mono text-xs text-gray-300 break-all">{hash}</p>
        </div>
      )}

      <Link to="/" className="mt-8 text-xs text-gray-400 hover:text-green-600 transition-colors">
        ← Back to CrediLab
      </Link>
    </div>
  );
}
