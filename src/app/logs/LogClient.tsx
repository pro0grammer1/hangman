'use client';

import React, { useEffect, useState } from 'react';
import { getAllLogs, LogEntry, resetLogs } from '@/modules/logdb';
import Card from '@/components/Card';
import { useRouter } from 'next/navigation';

export default function LogComponent() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      const entries = await getAllLogs();
      setLogs(entries);
    };

    fetchLogs();
  }, []);

  if (logs.length === 0) {
    return <div className="bg-[url('/background.jpg')] bg-no-repeat bg-cover text-black w-full min-h-[100dvh] py-2 overflow-hidden">

      <Card className="bg-[#f06643b4] items-center w-max mt-2" onClick={async () => { router.push('/') }}>Main Menu</Card>
      No logs found.</div>;
  }

  return (
    <div className="bg-[url('/background.jpg')] bg-no-repeat bg-cover text-black w-full min-h-[100dvh] py-2 overflow-hidden">
      <span className="items-center flex flex-row">
        <Card className=" bg-[#f06643b4] items-center w-max mt-2" onClick={async () => { router.push('/') }}>Main Menu</Card>
        <h2 className=" text-xl font-semibold mb-2">All Log Entries</h2>
      </span>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Game Mode</th>
            <th className="border px-2 py-1">Game Result</th>
            <th className="border px-2 py-1">Used Lives</th>
            <th className="border px-2 py-1">Total Lives</th>
            <th className="border px-2 py-1">Time Taken</th>
            <th className="border px-2 py-1">Time Setting</th>
            <th className="border px-2 py-1">Word</th>
            <th className="border px-2 py-1">WordArray</th>
            <th className="border px-2 py-1">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="border px-2 py-1">{log.id}</td>
              <td className="border px-2 py-1">{log.gameMode}</td>
              <td className="border px-2 py-1">{log.gameResult}</td>
              <td className="border px-2 py-1">{log.totalLives - log.usedLives}</td>
              <td className="border px-2 py-1">{log.totalLives}</td>
              <td className="border px-2 py-1">{log.timeTaken}</td>
              <td className="border px-2 py-1">{log.timeSetting ? 'On Game Start' : 'On Key Press'}</td>

              <td className="border px-2 py-1">{log.word}</td>
              <td className="border px-2 py-1">{log.WordArray}</td>
              <td className="border px-2 py-1">
                {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Card className="bg-[#f06643b4] flex flex-col items-center w-max-content mt-2" onClick={async () => { await resetLogs(); setLogs([]); }}>Reset Logs</Card>

    </div>
  );
}
