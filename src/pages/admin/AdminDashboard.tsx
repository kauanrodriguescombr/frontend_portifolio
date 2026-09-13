import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import api, { getImageUrl } from '@/services/api';
import { toast } from 'sonner';
import {
  FolderGit2,
  Award,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  LogOut,
  Eye,
  Loader2,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ProjectFormDialog, { Project } from '@/components/admin/ProjectFormDialog';
import CertificateFormDialog, { Certificate } from '@/components/admin/CertificateFormDialog';

type ActiveTab = 'projects' | 'certificates';

const AdminDashboard = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('projects');
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de Projetos
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Estados de Certificados
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoadingCertificates, setIsLoadingCertificates] = useState(true);
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);

  // Estados de Exclusão
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: 'project' | 'certificate'; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Busca Projetos
  const fetchProjects = useCallback(async () => {
    setIsLoadingProjects(true);
    try {
      const data = await api.get<{ status: string; projects: Project[] }>('/admin/projects');
      setProjects(data?.projects || []);
    } catch (err: any) {
      toast.error('Não foi possível carregar os projetos da API.');
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  // Busca Certificados
  const fetchCertificates = useCallback(async () => {
    setIsLoadingCertificates(true);
    try {
      const data = await api.get<{ status: string; certificates: Certificate[] }>('/admin/certificates');
      setCertificates(data?.certificates || []);
    } catch (err: any) {
      toast.error('Não foi possível carregar os certificados da API.');
    } finally {
      setIsLoadingCertificates(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchCertificates();
  }, [fetchProjects, fetchCertificates]);

  // Alterna publicação de projeto
  const handleTogglePublishProject = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/projects/${id}/publish`);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_published: !currentStatus } : p))
      );
      toast.success(`Projeto ${!currentStatus ? 'publicado' : 'despublicado'}.`);
    } catch (err: any) {
      toast.error('Erro ao alternar status do projeto.');
    }
  };

  // Alterna publicação de certificado
  const handleTogglePublishCert = async (id: string, currentStatus: boolean) => {
    try {
      await api.patch(`/certificates/${id}/publish`);
      setCertificates((prev) =>
        prev.map((c) => (c.id === id ? { ...c, is_published: !currentStatus } : c))
      );
      toast.success(`Certificado ${!currentStatus ? 'publicado' : 'despublicado'}.`);
    } catch (err: any) {
      toast.error('Erro ao alternar status do certificado.');
    }
  };

  // Executa exclusão
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      if (itemToDelete.type === 'project') {
        await api.delete(`/projects/${itemToDelete.id}`);
        setProjects((prev) => prev.filter((p) => p.id !== itemToDelete.id));
        toast.success(`Projeto "${itemToDelete.title}" excluído com sucesso.`);
      } else {
        await api.delete(`/certificates/${itemToDelete.id}`);
        setCertificates((prev) => prev.filter((c) => c.id !== itemToDelete.id));
        toast.success(`Certificado "${itemToDelete.title}" excluído com sucesso.`);
      }
    } catch (err: any) {
      toast.error('Erro ao excluir item.');
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
  };

  // Filtros
  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techs?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredCertificates = certificates.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.year.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Topbar com Glassmorphism */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-heading text-3xl text-foreground tracking-wider group-hover:text-primary transition-colors">
                KAUAN
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-body uppercase font-bold tracking-widest bg-primary/20 text-primary border border-primary/30">
                ADMIN
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-xs font-body font-medium hover:bg-white/10 transition-colors text-foreground"
            >
              Ver Portfólio Público
              <ArrowUpRight size={14} />
            </a>

            <div className="h-4 w-px bg-white/10 hidden sm:block" />

            <div className="text-right hidden md:block">
              <p className="text-xs font-body font-medium text-foreground">{user?.name || 'Administrador'}</p>
              <p className="text-[11px] font-body text-muted-foreground">{user?.email}</p>
            </div>

            <button
              onClick={logout}
              title="Sair do painel"
              className="p-2 rounded-full border border-white/10 hover:border-destructive/40 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Banner de Boas-Vindas e Ações */}
        <div className="certification-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-primary text-xs font-body uppercase tracking-wider font-semibold">
              <Sparkles size={14} />
              Gestão Dinâmica de Conteúdo
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl text-foreground tracking-wide mb-2">
              PAINEL DE CONTROLE
            </h1>
            <p className="font-body text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Adicione, edite ou alterne a publicação de projetos e certificados. Todas as imagens enviadas
              são automaticamente redimensionadas e convertidas para <strong className="text-foreground">.AVIF</strong> pelo servidor.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {activeTab === 'projects' ? (
              <button
                onClick={() => {
                  setSelectedProject(null);
                  setProjectDialogOpen(true);
                }}
                className="btn-primary gap-2 py-3 px-6 text-sm font-medium"
              >
                <Plus size={18} />
                Novo Projeto
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelectedCertificate(null);
                  setCertificateDialogOpen(true);
                }}
                className="btn-primary gap-2 py-3 px-6 text-sm font-medium"
              >
                <Plus size={18} />
                Novo Certificado
              </button>
            )}
          </div>
        </div>

        {/* Abas e Barra de Busca */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('projects')}
              className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full font-body text-sm font-medium transition-all ${
                activeTab === 'projects'
                  ? 'bg-white/15 text-foreground border border-white/20 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <FolderGit2 size={16} className={activeTab === 'projects' ? 'text-primary' : ''} />
              Projetos
              <span className="px-2 py-0.2 rounded-full text-xs bg-black/40 text-foreground font-mono">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full font-body text-sm font-medium transition-all ${
                activeTab === 'certificates'
                  ? 'bg-white/15 text-foreground border border-white/20 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Award size={16} className={activeTab === 'certificates' ? 'text-primary' : ''} />
              Certificações & Cursos
              <span className="px-2 py-0.2 rounded-full text-xs bg-black/40 text-foreground font-mono">
                {certificates.length}
              </span>
            </button>
          </div>

          {/* Busca */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={activeTab === 'projects' ? 'Buscar projetos...' : 'Buscar certificados...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground text-xs"
            />
          </div>
        </div>

        {/* ─── ABA DE PROJETOS ──────────────────────────────────────────────── */}
        {activeTab === 'projects' && (
          <section className="space-y-4">
            {isLoadingProjects ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="font-body text-sm">Carregando projetos...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="certification-card p-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground">
                  <FolderGit2 size={28} />
                </div>
                <h3 className="font-body text-lg font-semibold text-foreground">Nenhum projeto encontrado</h3>
                <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
                  {searchQuery
                    ? 'Nenhum resultado corresponde à sua pesquisa.'
                    : 'Você ainda não cadastrou nenhum projeto ou todos foram excluídos.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedProject(null);
                    setProjectDialogOpen(true);
                  }}
                  className="btn-primary py-2.5 px-6 text-xs mx-auto"
                >
                  <Plus size={16} />
                  Cadastrar Primeiro Projeto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="certification-card p-5 flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Topo do Card: Thumbnail + Status */}
                    <div className="space-y-4">
                      <div className="relative h-44 w-full rounded-xl overflow-hidden border border-white/10 bg-black/40">
                        <img
                          src={getImageUrl(project.image)}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                        {/* Badges de Destaque e Status sobrepostos */}
                        <div className="absolute top-3 left-3 flex gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-body font-bold uppercase tracking-wider backdrop-blur-md border ${
                              project.is_published
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {project.is_published ? 'Publicado' : 'Rascunho'}
                          </span>
                          {project.is_featured && (
                            <span className="px-2 py-1 rounded-full text-[10px] font-body font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 backdrop-blur-md">
                              Destaque
                            </span>
                          )}
                        </div>

                        <span className="absolute bottom-2 right-3 text-[10px] font-mono text-white/60 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                          {project.image.endsWith('.avif') ? 'AVIF' : 'IMAGEM'}
                        </span>
                      </div>

                      {/* Informações */}
                      <div>
                        <h3 className="font-heading text-4xl text-foreground tracking-wide mb-1.5 group-hover:text-primary transition-colors truncate">
                          {project.title}
                        </h3>
                        <p className="font-body text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                          {project.description}
                        </p>

                        {/* Tecnologias */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.techs?.map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-body bg-white/5 border border-white/10 text-foreground/80"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Rodapé: Switch de Publicação & Botões de Ação */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={project.is_published}
                          onCheckedChange={() => handleTogglePublishProject(project.id, project.is_published)}
                        />
                        <span className="text-xs font-body text-muted-foreground">
                          {project.is_published ? 'Ativo' : 'Oculto'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={project.access}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Abrir link do projeto"
                          className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedProject(project);
                            setProjectDialogOpen(true);
                          }}
                          title="Editar projeto"
                          className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setItemToDelete({
                              id: project.id,
                              type: 'project',
                              title: project.title,
                            })
                          }
                          title="Excluir projeto"
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ─── ABA DE CERTIFICADOS ─────────────────────────────────────────── */}
        {activeTab === 'certificates' && (
          <section className="space-y-4">
            {isLoadingCertificates ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="font-body text-sm">Carregando certificados...</p>
              </div>
            ) : filteredCertificates.length === 0 ? (
              <div className="certification-card p-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-muted-foreground">
                  <Award size={28} />
                </div>
                <h3 className="font-body text-lg font-semibold text-foreground">Nenhum certificado encontrado</h3>
                <p className="font-body text-sm text-muted-foreground max-w-md mx-auto">
                  {searchQuery
                    ? 'Nenhum resultado corresponde à sua pesquisa.'
                    : 'Cadastre certificações e cursos para exibi-los no carrossel do portfólio.'}
                </p>
                <button
                  onClick={() => {
                    setSelectedCertificate(null);
                    setCertificateDialogOpen(true);
                  }}
                  className="btn-primary py-2.5 px-6 text-xs mx-auto"
                >
                  <Plus size={16} />
                  Cadastrar Primeiro Certificado
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="certification-card p-6 flex flex-col justify-between group relative"
                  >
                    <div>
                      {/* Topo: Ícone + Ano + Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                          {cert.image ? (
                            <img
                              src={getImageUrl(cert.image)}
                              alt={cert.title}
                              className="w-10 h-10 object-contain rounded"
                            />
                          ) : (
                            <Award size={24} />
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-body text-xs font-medium text-foreground/80 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                            {cert.year}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-body font-bold uppercase tracking-wider border ${
                              cert.is_published
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {cert.is_published ? 'Ativo' : 'Rascunho'}
                          </span>
                        </div>
                      </div>

                      {/* Título & Organização */}
                      <h3 className="font-heading text-4xl sm:text-5xl text-foreground tracking-wide mb-1.5 group-hover:text-primary transition-colors">
                        {cert.title}
                      </h3>
                      <p className="font-body text-xs text-primary font-medium mb-3">
                        {cert.organization}
                      </p>

                      {/* Descrição */}
                      <p className="font-body text-xs text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {cert.description}
                      </p>
                    </div>

                    {/* Rodapé: Switch & Ações */}
                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={cert.is_published}
                          onCheckedChange={() => handleTogglePublishCert(cert.id, cert.is_published)}
                        />
                        <span className="text-xs font-body text-muted-foreground">
                          {cert.is_published ? 'Exibindo' : 'Oculto'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <a
                          href={cert.credential}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Ver credencial oficial"
                          className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ExternalLink size={16} />
                        </a>
                        <button
                          onClick={() => {
                            setSelectedCertificate(cert);
                            setCertificateDialogOpen(true);
                          }}
                          title="Editar certificado"
                          className="p-2 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setItemToDelete({
                              id: cert.id,
                              type: 'certificate',
                              title: cert.title,
                            })
                          }
                          title="Excluir certificado"
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Diálogos de Formulário */}
      <ProjectFormDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        project={selectedProject}
        onSuccess={fetchProjects}
      />

      <CertificateFormDialog
        open={certificateDialogOpen}
        onOpenChange={setCertificateDialogOpen}
        certificate={selectedCertificate}
        onSuccess={fetchCertificates}
      />

      {/* Confirmação de Exclusão */}
      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent className="bg-background/95 border border-white/15 text-foreground backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-body text-xl font-bold tracking-tight text-foreground">
              Confirmar Exclusão
            </AlertDialogTitle>
            <AlertDialogDescription className="font-body text-sm text-muted-foreground">
              Tem certeza de que deseja excluir permanentemente o item{' '}
              <strong className="text-foreground font-semibold">"{itemToDelete?.title}"</strong>?
              {itemToDelete?.type === 'project' && ' O arquivo de imagem vinculado também será removido.'}
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="border-white/15 text-foreground hover:bg-white/10">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-medium"
            >
              {isDeleting ? 'Excluindo...' : 'Sim, Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
