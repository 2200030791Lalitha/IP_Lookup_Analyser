import { Authenticated, Unauthenticated, useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster, toast } from "sonner";
import { useState } from "react";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-semibold accent-text">IP & Network Analysis Tool</h2>
        <SignOutButton />
      </header>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Content />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [ip, setIp] = useState("");
  const lookup = useAction(api.ipLookup.lookup);
  const scanPorts = useAction(api.portScanner.scanPorts);
  const history = useQuery(api.ipLookup.getHistory);
  const [result, setResult] = useState<any>(null);
  const [portResults, setPortResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ip.trim()) {
      toast.error("Please enter an IP address");
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await lookup({ ip: ip.trim() });
      setResult(data);
      toast.success("Lookup successful!");
    } catch (error) {
      console.error("Lookup error:", error);
      const errorMessage = error instanceof Error ? error.message : "Lookup failed. Please check the IP address.";
      toast.error(errorMessage);
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePortScan = async () => {
    if (!ip.trim()) {
      toast.error("Please enter an IP address");
      return;
    }

    setIsScanning(true);
    try {
      const results = await scanPorts({ host: ip.trim() });
      setPortResults(results);
      toast.success("Port scan completed!");
    } catch (error) {
      console.error("Scan error:", error);
      const errorMessage = error instanceof Error ? error.message : "Port scan failed. Please check the IP address.";
      toast.error(errorMessage);
      setPortResults(null);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold accent-text mb-4">IP & Network Analysis Tool</h1>
        <Authenticated>
          <p className="text-xl text-slate-600">
            Welcome back, {loggedInUser?.email ?? "friend"}!
          </p>
        </Authenticated>
        <Unauthenticated>
          <p className="text-xl text-slate-600">Sign in to get started</p>
        </Unauthenticated>
      </div>

      <Unauthenticated>
        <SignInForm />
      </Unauthenticated>

      <Authenticated>
        <div className="space-y-8">
          <form onSubmit={handleLookup} className="flex gap-4">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IP address (e.g. 8.8.8.8)"
              className="flex-1 px-4 py-2 border rounded"
            />
            <button
              type="submit"
              disabled={isLoading || !ip.trim()}
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:bg-indigo-300"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Looking up...
                </span>
              ) : (
                "Lookup"
              )}
            </button>
            <button
              type="button"
              onClick={handlePortScan}
              disabled={isScanning || !ip.trim()}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-purple-300"
            >
              {isScanning ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Scanning...
                </span>
              ) : (
                "Scan Ports"
              )}
            </button>
          </form>

          {result && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Results for {result.query}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">IP Address</p>
                  <p className="text-gray-600">{result.query}</p>
                </div>
                <div>
                  <p className="font-medium">Country</p>
                  <p className="text-gray-600">{result.country}</p>
                </div>
                <div>
                  <p className="font-medium">City</p>
                  <p className="text-gray-600">{result.city}</p>
                </div>
                <div>
                  <p className="font-medium">Region</p>
                  <p className="text-gray-600">{result.regionName}</p>
                </div>
                <div>
                  <p className="font-medium">ISP</p>
                  <p className="text-gray-600">{result.isp}</p>
                </div>
                <div>
                  <p className="font-medium">Organization</p>
                  <p className="text-gray-600">{result.org}</p>
                </div>
                <div>
                  <p className="font-medium">Coordinates</p>
                  <p className="text-gray-600">
                    {result.lat}, {result.lon}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Timezone</p>
                  <p className="text-gray-600">{result.timezone}</p>
                </div>
              </div>
            </div>
          )}

          {portResults && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Port Scan Results</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Port</th>
                      <th className="text-left py-2">Service</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {portResults.map((result: any, index: number) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2">{result.port}</td>
                        <td className="py-2">{result.service}</td>
                        <td className={`py-2 ${result.status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
                          {result.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {history && history.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Recent Lookups</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">IP</th>
                      <th className="text-left py-2">Location</th>
                      <th className="text-left py-2">ISP</th>
                      <th className="text-left py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry) => (
                      <tr key={entry._id} className="border-b hover:bg-gray-50">
                        <td className="py-2">{entry.ip}</td>
                        <td className="py-2">
                          {entry.city}, {entry.country}
                        </td>
                        <td className="py-2">{entry.isp}</td>
                        <td className="py-2">
                          {new Date(entry.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Authenticated>
    </div>
  );
}
