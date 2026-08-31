"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ImagePlus, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { PatternFormat } from "react-number-format";
import { sendPasswordResetAction } from "@/app/actions/auth";
import { updateMerchant, uploadMerchantLogo } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Merchant } from "@/lib/types";

function formatFileSize(value: number) {
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function SettingsPageClient({ merchant, email }: { merchant: Merchant; email: string }) {
  const [storeName, setStoreName] = useState(merchant.store_name);
  const [phone, setPhone] = useState(merchant.phone ?? "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(merchant.logo_url);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setStoreName(merchant.store_name);
    setPhone(merchant.phone ?? "");
    setPreviewUrl(merchant.logo_url);
  }, [merchant]);

  function handleSelectFile(file: File | null) {
    if (!file) return;

    if (!/\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
      toast.error("Use apenas arquivos JPG, JPEG, PNG ou WEBP.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem precisa ter no máximo 2 MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!storeName.trim()) {
      toast.error("Informe o nome do comércio.");
      return;
    }

    setIsSaving(true);

    try {
      if (selectedFile) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("logo", selectedFile);
        const uploadResult = await uploadMerchantLogo(formData);
        if (!uploadResult.ok) {
          toast.error(uploadResult.message);
          setIsUploading(false);
          setIsSaving(false);
          return;
        }
        setIsUploading(false);
      }

      const result = await updateMerchant({
        store_name: storeName.trim(),
        phone,
      });

      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } finally {
      setIsSaving(false);
      setIsUploading(false);
    }
  }

  async function handlePasswordReset() {
    const result = await sendPasswordResetAction(email);
    if (result.ok) {
      toast.success("Enviamos um link para seu email");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[28px] font-bold leading-tight">Configurações</h2>
        <p className="mt-1 text-sm text-slate-500">Atualize os dados do comércio, a conta e a assinatura.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do Comércio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span className="font-medium">Nome do Comércio</span>
              <Input value={storeName} onChange={(event) => setStoreName(event.target.value)} placeholder="Meu Comércio" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-slate-600">
              <span className="font-medium">Telefone</span>
              <PatternFormat
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-blue-500/20"
                value={phone}
                onValueChange={(values) => setPhone(values.value)}
                format="(##) #####-####"
                allowEmptyFormatting
                mask="_"
              />
            </label>
          </div>

          <div
            className={`rounded-2xl border-2 border-dashed p-5 transition ${isDragging ? "border-primary bg-blue-50/60" : "border-slate-200 bg-slate-50"}`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              handleSelectFile(event.dataTransfer.files?.[0] ?? null);
            }}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                {previewUrl ? (
                  <img src={previewUrl} alt="Logo do comércio" className="h-16 w-16 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm">
                    <ImagePlus className="h-7 w-7" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-950">Logo do comércio</p>
                  <p className="text-sm text-slate-500">Arraste uma imagem aqui ou selecione um arquivo.</p>
                  {selectedFile ? <p className="text-xs text-slate-400">{selectedFile.name} · {formatFileSize(selectedFile.size)}</p> : null}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => inputRef.current?.click()}>
                  <UploadCloud className="h-4 w-4" />
                  {previewUrl ? "Trocar foto" : "Adicionar logo"}
                </Button>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  className="hidden"
                  onChange={(event) => handleSelectFile(event.target.files?.[0] ?? null)}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="success" onClick={handleSave} disabled={isSaving || isUploading}>
              {isSaving || isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Salvar alterações
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Minha Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex flex-col gap-1 text-sm text-slate-600">
            <span className="font-medium">Email</span>
            <Input value={email} readOnly disabled className="bg-slate-100" />
          </label>
          <Button variant="outline" onClick={handlePasswordReset}>
            Alterar senha
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assinatura</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Plano Gratuito — 7 dias de teste</p>
            <p className="mt-3 text-sm text-slate-600">Após o período de teste, seu plano custa R$ 29,90/mês.</p>
          </div>
          <Button variant="secondary" disabled title="Em breve">
            Gerenciar assinatura
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
