import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Upload, Loader2, Award, Sparkles } from 'lucide-react';
import api, { getImageUrl } from '@/services/api';

export interface Certificate {
  id: string;
  title: string;
  description: string;
  organization: string;
  year: string;
  credential: string;
  image?: string | null;
  order_index: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CertificateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate?: Certificate | null;
  onSuccess: () => void;
}

export const CertificateFormDialog: React.FC<CertificateFormDialogProps> = ({
  open,
  onOpenChange,
  certificate,
  onSuccess,
}) => {
  const isEditing = !!certificate;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organization, setOrganization] = useState('');
  const [year, setYear] = useState('');
  const [credential, setCredential] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  // Imagem opcional
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (certificate) {
      setTitle(certificate.title || '');
      setDescription(certificate.description || '');
      setOrganization(certificate.organization || '');
      setYear(certificate.year || '');
      setCredential(certificate.credential || '');
      setOrderIndex(certificate.order_index ?? 0);
      setIsPublished(certificate.is_published ?? true);
      setSelectedFile(null);
      setPreviewUrl(certificate.image ? getImageUrl(certificate.image) : null);
    } else {
      setTitle('');
      setDescription('');
      setOrganization('');
      setYear(new Date().getFullYear().toString());
      setCredential('');
      setOrderIndex(0);
      setIsPublished(true);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [certificate, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione um arquivo de imagem válido.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('O título do certificado é obrigatório.');
      return;
    }

    if (!organization.trim()) {
      toast.error('A instituição emissora é obrigatória.');
      return;
    }

    if (!year.trim()) {
      toast.error('O ano é obrigatório.');
      return;
    }

    if (!description.trim()) {
      toast.error('A descrição do certificado é obrigatória.');
      return;
    }

    if (!credential.trim()) {
      toast.error('O link da credencial é obrigatório.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('organization', organization.trim());
      formData.append('year', year.trim());
      formData.append('credential', credential.trim());
      formData.append('order_index', String(orderIndex));
      formData.append('is_published', String(isPublished));

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (isEditing && certificate) {
        await api.put(`/certificates/${certificate.id}`, formData, true);
        toast.success('Certificado atualizado com sucesso!');
      } else {
        await api.post('/certificates', formData, true);
        toast.success('Certificado cadastrado com sucesso!');
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Erro ao salvar certificado.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="font-body text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {isEditing ? 'Editar Certificado' : 'Novo Certificado'}
          </DialogTitle>
          <DialogDescription className="font-body text-sm text-muted-foreground mt-1">
            {isEditing
              ? 'Atualize as informações do curso ou certificação.'
              : 'Cadastre uma nova certificação para ser exibida no carrossel do portfólio.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="cert-title" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
              Título do Curso / Certificação *
            </Label>
            <Input
              id="cert-title"
              placeholder="Ex: Desenvolvimento de Software"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-foreground"
            />
          </div>

          {/* Instituição e Ano */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
                Instituição Emissora *
              </Label>
              <Input
                id="organization"
                placeholder="Ex: Cubos Academy"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
                Ano de Conclusão *
              </Label>
              <Input
                id="year"
                placeholder="Ex: 2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-foreground"
              />
            </div>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="cert-description" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
              Descrição do Conteúdo *
            </Label>
            <Textarea
              id="cert-description"
              rows={3}
              placeholder="Resuma os tópicos abordados no curso ou formação..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-foreground resize-none leading-relaxed"
            />
          </div>

          {/* Link da Credencial */}
          <div className="space-y-2">
            <Label htmlFor="credential" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
              Link de Validação / Credencial *
            </Label>
            <Input
              id="credential"
              type="url"
              placeholder="https://drive.google.com/..."
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-foreground"
            />
          </div>

          {/* Imagem / Badge Opcional */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-body text-xs text-foreground/80 uppercase tracking-wider">
                Imagem ou Badge (Opcional)
              </Label>
              <span className="inline-flex items-center gap-1 text-[11px] text-primary/90 font-medium">
                <Sparkles size={13} />
                Convertido para .AVIF
              </span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer rounded-xl border border-dashed border-white/15 bg-white/5 hover:border-primary/50 hover:bg-white/10 p-4 transition-all flex items-center gap-4"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-10 h-10 object-contain rounded-lg" />
                ) : (
                  <Award size={24} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs font-medium text-foreground truncate">
                  {selectedFile ? selectedFile.name : 'Clique para selecionar uma imagem ou selo'}
                </p>
                <p className="font-body text-[11px] text-muted-foreground">
                  Opcional • Se vazio, usará o ícone padrão de conquista
                </p>
              </div>
              <Upload size={16} className="text-muted-foreground" />
            </div>
          </div>

          {/* Ordem e Publicação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <div className="space-y-2">
              <Label htmlFor="certOrder" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
                Ordem de Exibição
              </Label>
              <Input
                id="certOrder"
                type="number"
                min={0}
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                className="bg-white/5 border-white/10 text-foreground"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="space-y-0.5">
                <Label className="font-body text-xs text-foreground font-medium">Publicado</Label>
                <p className="text-[11px] text-muted-foreground">Visível no carrossel</p>
              </div>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-full border border-white/15 text-foreground hover:bg-white/10 font-body text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-2.5 text-sm font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </span>
              ) : isEditing ? (
                'Salvar Alterações'
              ) : (
                'Publicar Certificado'
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateFormDialog;
