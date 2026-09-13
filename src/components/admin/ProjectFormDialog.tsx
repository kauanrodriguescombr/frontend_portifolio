import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Upload, X, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import api, { getImageUrl } from '@/services/api';

export interface Project {
  id: string;
  title: string;
  description: string;
  techs: string[];
  image: string;
  repo?: string | null;
  access: string;
  order_index: number;
  is_published: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;
}

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
  onSuccess: () => void;
}

export const ProjectFormDialog: React.FC<ProjectFormDialogProps> = ({
  open,
  onOpenChange,
  project,
  onSuccess,
}) => {
  const isEditing = !!project;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [techs, setTechs] = useState<string[]>([]);
  const [repo, setRepo] = useState('');
  const [access, setAccess] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  // Imagem
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setDescription(project.description || '');
      setTechs(Array.isArray(project.techs) ? project.techs : []);
      setTechInput('');
      setRepo(project.repo || '');
      setAccess(project.access || '');
      setOrderIndex(project.order_index ?? 0);
      setIsPublished(project.is_published ?? true);
      setIsFeatured(project.is_featured ?? false);
      setSelectedFile(null);
      setPreviewUrl(getImageUrl(project.image));
    } else {
      setTitle('');
      setDescription('');
      setTechs([]);
      setTechInput('');
      setRepo('');
      setAccess('');
      setOrderIndex(0);
      setIsPublished(true);
      setIsFeatured(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [project, open]);

  const handleAddTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !techs.includes(trimmed)) {
      setTechs([...techs, trimmed]);
      setTechInput('');
    }
  };

  const handleRemoveTech = (techToRemove: string) => {
    setTechs(techs.filter((t) => t !== techToRemove));
  };

  const handleKeyDownTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTech();
    }
  };

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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, solte um arquivo de imagem válido.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('O título do projeto é obrigatório.');
      return;
    }

    if (!description.trim()) {
      toast.error('A descrição do projeto é obrigatória.');
      return;
    }

    if (!access.trim()) {
      toast.error('O link de acesso do projeto é obrigatório.');
      return;
    }

    if (!isEditing && !selectedFile) {
      toast.error('Selecione uma imagem para o novo projeto.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('techs', JSON.stringify(techs));
      formData.append('access', access.trim());
      formData.append('repo', repo.trim());
      formData.append('order_index', String(orderIndex));
      formData.append('is_published', String(isPublished));
      formData.append('is_featured', String(isFeatured));

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (isEditing && project) {
        await api.put(`/projects/${project.id}`, formData, true);
        toast.success('Projeto atualizado com sucesso!');
      } else {
        await api.post('/projects', formData, true);
        toast.success('Projeto criado com sucesso!');
      }

      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Erro ao salvar projeto.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border border-white/10 text-foreground">
        <DialogHeader>
          <DialogTitle className="font-body text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {isEditing ? 'Editar Projeto' : 'Novo Projeto'}
          </DialogTitle>
          <DialogDescription className="font-body text-sm text-muted-foreground mt-1">
            {isEditing
              ? 'Atualize as informações do projeto. Novas imagens serão convertidas para .avif automaticamente.'
              : 'Preencha os campos abaixo. A imagem será otimizada e convertida para .avif pelo backend.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Upload e Preview da Imagem */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="font-body text-xs text-foreground/80 uppercase tracking-wider">
                Imagem do Card *
              </Label>
              <span className="inline-flex items-center gap-1 text-[11px] text-primary/90 font-medium">
                <Sparkles size={13} />
                Conversão automática para .AVIF
              </span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center min-h-[190px] p-4 text-center ${
                previewUrl
                  ? 'border-white/20 bg-black/40 hover:border-primary/50'
                  : 'border-white/15 bg-white/5 hover:border-primary/50 hover:bg-white/10'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewUrl ? (
                <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white">
                    <Upload size={24} />
                    <span className="font-body text-xs font-medium">
                      Clique ou arraste para substituir a imagem
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary">
                    <ImageIcon size={24} />
                  </div>
                  <p className="font-body text-sm font-medium text-foreground">
                    Clique para selecionar ou arraste uma imagem aqui
                  </p>
                  <p className="font-body text-xs text-muted-foreground">
                    PNG, JPG, JPEG, WEBP até 15MB • Convertida para .avif no upload
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
              Título do Projeto *
            </Label>
            <Input
              id="title"
              placeholder="Ex: Fluxo Financeiro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-foreground"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
              Descrição Detalhada *
            </Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Descreva o propósito do projeto, funcionalidades e diferenciais..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-white/5 border-white/10 text-foreground leading-relaxed resize-none"
            />
          </div>

          {/* Tecnologias */}
          <div className="space-y-2">
            <Label className="font-body text-xs text-foreground/80 uppercase tracking-wider">
              Tecnologias Utilizadas
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Digite e pressione Enter (ex: ReactJS, Node.js)"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleKeyDownTech}
                className="bg-white/5 border-white/10 text-foreground flex-1"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-xs font-body font-medium transition-colors"
              >
                Adicionar
              </button>
            </div>

            {/* Tags Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {techs.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-body font-medium bg-white/10 text-foreground rounded-full border border-white/15 backdrop-blur-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(tech)}
                    className="hover:text-primary transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {techs.length === 0 && (
                <span className="text-xs text-muted-foreground italic">
                  Nenhuma tecnologia adicionada ainda.
                </span>
              )}
            </div>
          </div>

          {/* Links: Acesso e Repositório */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="access" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
                Link da Aplicação (No Ar) *
              </Label>
              <Input
                id="access"
                type="url"
                placeholder="https://meuprojeto.com.br"
                value={access}
                onChange={(e) => setAccess(e.target.value)}
                required
                className="bg-white/5 border-white/10 text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repo" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
                Link do GitHub (Opcional)
              </Label>
              <Input
                id="repo"
                type="url"
                placeholder="https://github.com/..."
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="bg-white/5 border-white/10 text-foreground"
              />
            </div>
          </div>

          {/* Ordem e Opções */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-white/10">
            <div className="space-y-2">
              <Label htmlFor="orderIndex" className="font-body text-xs text-foreground/80 uppercase tracking-wider">
                Ordem de Exibição
              </Label>
              <Input
                id="orderIndex"
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
                <p className="text-[11px] text-muted-foreground">Visível no portfólio</p>
              </div>
              <Switch checked={isPublished} onCheckedChange={setIsPublished} />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="space-y-0.5">
                <Label className="font-body text-xs text-foreground font-medium">Destaque</Label>
                <p className="text-[11px] text-muted-foreground">Item prioritário</p>
              </div>
              <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
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
                  Salvando e Otimizando...
                </span>
              ) : isEditing ? (
                'Salvar Alterações'
              ) : (
                'Publicar Projeto'
              )}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectFormDialog;
