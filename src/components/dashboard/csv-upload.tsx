import { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCsvUpload } from '@/hooks/useCsvUpload';
import { getApiBaseUrl } from '@/lib/apiBaseUrl';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export function CsvUploadWidget() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const baseUrl = getApiBaseUrl();
  const getToken = () => localStorage.getItem('qeads_token');
  const { uploading, error, result, upload } = useCsvUpload(baseUrl, getToken);
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string>('');

  const onPick = () => inputRef.current?.click();
  const onChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    await upload(file).catch(() => {});
  };

  useEffect(() => {
    if (result && !uploading) {
      toast({
        title: 'CSV imported successfully',
        description: `Imported ${result.imported} transactions. Top tips ready.`,
      });
    }
  }, [result, uploading, toast]);

  useEffect(() => {
    if (error && !uploading) {
      toast({
        title: 'Upload failed',
        description: String(error),
        variant: 'destructive',
      });
    }
  }, [error, uploading, toast]);

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Import Monthly CSV</CardTitle>
        <CardDescription>Upload a CSV with columns: date, merchant, amount, currency (optional). We'll categorize, flag anomalies, and suggest 3 saving tips.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={onChange} />
        <div className="flex items-center gap-3">
          <Button onClick={onPick} disabled={uploading}>{uploading ? 'Uploading…' : 'Choose CSV'}</Button>
          {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
        </div>
        {uploading && <div className="text-sm text-muted-foreground">Uploading and verifying…</div>}
        {error && <div className="text-sm text-red-500">{String(error)}</div>}
        {result && (
          <div className="space-y-2">
            <div className="text-sm">Imported: <b>{result.imported}</b></div>
            <div className="space-y-1">
              <div className="text-sm font-medium">Top saving tips</div>
              <ul className="list-disc pl-5 text-sm">
                {result.tips?.map((t: any) => (
                  <li key={t.rank}>
                    <b className="capitalize">{t.category}</b>: {t.tip} (save ~₹{t.potentialSavings})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
