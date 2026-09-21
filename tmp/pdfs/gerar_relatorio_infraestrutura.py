from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

PROJECT = Path(r"C:\Users\User\Desktop\CLAUDE\projetos\4medic-acompanhamento-google-docs-2026-09-14\web-supabase-preview-v1")
OUTPUT = PROJECT / "output" / "pdf" / "auditoria_contas_deploy_austral_performance.pdf"

NAVY = colors.HexColor("#10243E")
BLUE = colors.HexColor("#2563EB")
CYAN = colors.HexColor("#19A7AE")
PALE = colors.HexColor("#EDF4FF")
INK = colors.HexColor("#18212F")
MUTED = colors.HexColor("#5F6B7A")
LINE = colors.HexColor("#D9E2EF")
WHITE = colors.white
AMBER_BG = colors.HexColor("#FFF7E6")
AMBER = colors.HexColor("#9A5B00")


def register_fonts():
    regular = Path(r"C:\Windows\Fonts\arial.ttf")
    bold = Path(r"C:\Windows\Fonts\arialbd.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("DocRegular", str(regular)))
        pdfmetrics.registerFont(TTFont("DocBold", str(bold)))
    else:
        pdfmetrics.registerFont(TTFont("DocRegular", r"C:\Windows\Fonts\calibri.ttf"))
        pdfmetrics.registerFont(TTFont("DocBold", r"C:\Windows\Fonts\calibrib.ttf"))


register_fonts()

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="DocTitle", fontName="DocBold", fontSize=24, leading=29,
    textColor=WHITE, alignment=TA_LEFT, spaceAfter=5 * mm,
))
styles.add(ParagraphStyle(
    name="Kicker", fontName="DocBold", fontSize=8.5, leading=11,
    textColor=colors.HexColor("#8EDBE0"), tracking=1.6, uppercase=True,
))
styles.add(ParagraphStyle(
    name="Section", fontName="DocBold", fontSize=15, leading=19,
    textColor=NAVY, spaceBefore=3 * mm, spaceAfter=3 * mm,
))
styles.add(ParagraphStyle(
    name="Subsection", fontName="DocBold", fontSize=10.5, leading=14,
    textColor=INK, spaceBefore=2 * mm, spaceAfter=1.5 * mm,
))
styles.add(ParagraphStyle(
    name="Body2", fontName="DocRegular", fontSize=9.2, leading=13.2,
    textColor=INK, spaceAfter=2.2 * mm,
))
styles.add(ParagraphStyle(
    name="Small2", fontName="DocRegular", fontSize=7.6, leading=10.2,
    textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="Cell", fontName="DocRegular", fontSize=8.2, leading=11,
    textColor=INK,
))
styles.add(ParagraphStyle(
    name="CellBold", fontName="DocBold", fontSize=8.2, leading=11,
    textColor=NAVY,
))
styles.add(ParagraphStyle(
    name="Link", fontName="DocRegular", fontSize=7.7, leading=10.5,
    textColor=BLUE,
))
styles.add(ParagraphStyle(
    name="Alert", fontName="DocRegular", fontSize=8.8, leading=12.5,
    textColor=AMBER,
))


def p(text, style="Body2"):
    return Paragraph(text, styles[style])


def url_link(label, url):
    return f'<link href="{escape(url)}" color="#2563EB"><u>{escape(label)}</u></link>'


def file_uri(path):
    return Path(path).as_uri()


def file_link(path, label=None):
    path = str(path)
    label = label or path
    return f'<link href="{escape(file_uri(path))}" color="#2563EB"><u>{escape(label)}</u></link>'


def info_table(rows, widths=(44 * mm, 126 * mm)):
    data = [[p(escape(k), "CellBold"), p(v, "Cell")] for k, v in rows]
    table = Table(data, colWidths=list(widths), hAlign="LEFT")
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("BACKGROUND", (0, 0), (0, -1), PALE),
        ("BOX", (0, 0), (-1, -1), 0.6, LINE),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, LINE),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return table


def path_card(path, description):
    return KeepTogether([
        p(f"<b>{escape(description)}</b>", "CellBold"),
        p(file_link(path), "Link"),
        Spacer(1, 2.2 * mm),
    ])


def header_footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    if doc.page == 1:
        canvas.setFillColor(NAVY)
        canvas.rect(0, height - 78 * mm, width, 78 * mm, fill=1, stroke=0)
        canvas.setFillColor(CYAN)
        canvas.rect(0, height - 78 * mm, 7 * mm, 78 * mm, fill=1, stroke=0)
        canvas.setFillColor(colors.HexColor("#8EDBE0"))
        canvas.setFont("DocBold", 9)
        canvas.drawString(20 * mm, height - 25 * mm, "AUDITORIA DE INFRAESTRUTURA")
        canvas.setFillColor(WHITE)
        canvas.setFont("DocBold", 25)
        canvas.drawString(20 * mm, height - 43 * mm, "Austral Performance")
        canvas.setFont("DocRegular", 10)
        canvas.drawString(20 * mm, height - 57 * mm, "Contas, publicação, banco de dados e arquivos de configuração")
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(20 * mm, 14 * mm, width - 20 * mm, 14 * mm)
    canvas.setFont("DocRegular", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(20 * mm, 9.2 * mm, "Austral Performance - auditoria técnica de contas e infraestrutura")
    canvas.drawRightString(width - 20 * mm, 9.2 * mm, f"Página {doc.page}")
    canvas.restoreState()


def build():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(OUTPUT), pagesize=A4,
        leftMargin=20 * mm, rightMargin=20 * mm,
        topMargin=20 * mm, bottomMargin=20 * mm,
        title="Auditoria de contas e infraestrutura - Austral Performance",
        author="Codex",
        subject="Vercel, Supabase, projeto local e arquivos de configuração",
    )
    first = Frame(20 * mm, 20 * mm, 170 * mm, 190 * mm, id="first")
    later = Frame(20 * mm, 20 * mm, 170 * mm, 257 * mm, id="later")
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=first, onPage=header_footer, autoNextPageTemplate="content"),
        PageTemplate(id="content", frames=later, onPage=header_footer),
    ])

    story = [
        Spacer(1, 4 * mm),
        p("Resumo executivo", "Section"),
        p("Esta auditoria identifica onde o painel foi publicado, qual conta está vinculada à Vercel, qual projeto Supabase atende a aplicação e onde permanecem as configurações locais. A verificação foi feita em 19 de setembro de 2026, sem alterações na infraestrutura."),
        info_table([
            ("Aplicação", url_link("austral-performance.vercel.app", "https://austral-performance.vercel.app")),
            ("Conta Vercel", "taweragt@gmail.com"),
            ("Time Vercel", "Taiom - claude (taiom-claude)"),
            ("Projeto Supabase", "Taiom-austral"),
            ("Referência Supabase", "fcqkdvuqpabuvwfmigzv"),
            ("Proprietário do painel", "taweragt@gmail.com"),
        ]),
        Spacer(1, 5 * mm),
        Table([[p("SEGURANÇA", "CellBold"), p("Tokens e chaves sensíveis não são reproduzidos neste documento. O relatório informa apenas a localização e a natureza das credenciais encontradas.", "Alert")]], colWidths=[28 * mm, 142 * mm], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), AMBER_BG),
            ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#F2D49B")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 7),
            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ])),
        PageBreak(),

        p("1. Publicação na Vercel", "Section"),
        p("A sessão autenticada da Vercel e o vínculo local do projeto confirmam os dados abaixo."),
        info_table([
            ("E-mail", "taweragt@gmail.com"),
            ("Usuário", "taweragt-4638"),
            ("Time", "Taiom - claude"),
            ("Slug", "taiom-claude"),
            ("Plano", "Hobby"),
            ("ID do time", "team_np8BBPfcFmRq8OM7HmJ7uFKZ"),
            ("Projeto", "web-supabase-preview-v1"),
            ("ID do projeto", "prj_OT9Vt1HBHQwlkTYPHlm6EpCVaLZf"),
            ("Domínio oficial", url_link("https://austral-performance.vercel.app", "https://austral-performance.vercel.app")),
            ("Domínio técnico", url_link("https://web-supabase-preview-v1.vercel.app", "https://web-supabase-preview-v1.vercel.app")),
        ]),
        Spacer(1, 5 * mm),
        p("Pasta usada no deploy", "Subsection"),
        p(file_link(PROJECT), "Link"),
        Spacer(1, 2 * mm),
        p("O arquivo <b>.vercel/project.json</b> liga essa pasta ao projeto e ao time informados acima. O arquivo <b>vercel.json</b> define URLs limpas e cabeçalhos básicos de segurança."),
        PageBreak(),

        p("2. Banco de dados Supabase", "Section"),
        info_table([
            ("Projeto", "Taiom-austral"),
            ("Referência", "fcqkdvuqpabuvwfmigzv"),
            ("Região documentada", "São Paulo"),
            ("URL da API", url_link("https://fcqkdvuqpabuvwfmigzv.supabase.co", "https://fcqkdvuqpabuvwfmigzv.supabase.co")),
            ("Painel administrativo", url_link("Abrir projeto no Supabase", "https://supabase.com/dashboard/project/fcqkdvuqpabuvwfmigzv")),
            ("Proprietário no painel", "taweragt@gmail.com"),
        ]),
        Spacer(1, 4 * mm),
        p("Precisão sobre a conta", "Subsection"),
        p("Os registros comprovam que <b>taweragt@gmail.com</b> é o proprietário dentro da aplicação conectada ao Supabase. Não foi encontrado um registro local separado que comprove diretamente o e-mail da conta administrativa usada para entrar no site supabase.com; esse é, porém, o único e-mail real encontrado no histórico dessa configuração."),
        p("Configuração encontrada", "Subsection"),
        p(file_link(PROJECT / "supabase-config.js"), "Link"),
        p("Esse arquivo contém a URL do projeto e uma chave publicável. Não contém senha, chave <i>service_role</i> ou token administrativo. Não há arquivo <b>.env</b> dentro da pasta deste projeto."),
        PageBreak(),

        p("3. Credenciais e sessões locais", "Section"),
        p("A sessão da CLI da Vercel está armazenada nos arquivos globais abaixo. Eles ficam fora da pasta do projeto e não devem ser compartilhados."),
        path_card(r"C:\Users\User\AppData\Roaming\com.vercel.cli\Data\auth.json", "Credenciais da CLI da Vercel"),
        path_card(r"C:\Users\User\AppData\Roaming\com.vercel.cli\Data\config.json", "Time atual e preferências da CLI"),
        info_table([
            ("auth.json", "Contém token de acesso, refresh token, ID do usuário e validade da sessão. Valores omitidos por segurança."),
            ("config.json", "Registra o time atual: team_np8BBPfcFmRq8OM7HmJ7uFKZ."),
            ("Supabase", "Nenhum token administrativo, senha ou service_role key foi encontrado na pasta do projeto."),
        ]),
        Spacer(1, 5 * mm),
        Table([[p("RECOMENDAÇÃO", "CellBold"), p("Se este relatório ou o histórico técnico for compartilhado externamente, renove a sessão da Vercel CLI e não envie o arquivo auth.json.", "Alert")]], colWidths=[34 * mm, 136 * mm], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), AMBER_BG),
            ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#F2D49B")),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("LEFTPADDING", (0, 0), (-1, -1), 7),
            ("RIGHTPADDING", (0, 0), (-1, -1), 7),
            ("TOPPADDING", (0, 0), (-1, -1), 7),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
        ])),
        PageBreak(),

        p("4. Arquivos relevantes", "Section"),
        p("Vercel e publicação", "Subsection"),
    ]

    vercel_files = [
        (PROJECT / ".vercel" / "project.json", "Vínculo entre pasta, projeto e time Vercel"),
        (PROJECT / ".vercel" / "README.txt", "Orientação criada pela Vercel para a pasta de vínculo"),
        (PROJECT / ".vercelignore", "Exclusões do pacote publicado"),
        (PROJECT / ".gitignore", "Exclusões do controle de versão"),
        (PROJECT / "vercel.json", "Cabeçalhos e comportamento do deploy"),
    ]
    for path, desc in vercel_files:
        story.append(path_card(path, desc))

    story.append(p("Supabase e aplicação", "Subsection"))
    app_files = [
        (PROJECT / "supabase-config.js", "URL e chave publicável do Supabase"),
        (PROJECT / "supabase-app.js", "Autenticação, leitura e gravação no Supabase"),
        (PROJECT / "index.html", "Carregamento dos scripts e estrutura da aplicação"),
    ]
    for path, desc in app_files:
        story.append(path_card(path, desc))

    story.extend([PageBreak(), p("5. Migrações e documentação", "Section"), p("Migrações SQL", "Subsection")])
    migrations = [
        ("001_initial_schema.sql", "Estrutura inicial, políticas RLS e armazenamento"),
        ("002_seed_history.sql", "Carga inicial do histórico"),
        ("003_auth_bootstrap.sql", "Autorização inicial do proprietário"),
        ("004_workspace_invitations.sql", "Convites e gerenciamento de acessos"),
        ("005_client_display_settings.sql", "Preferências de exibição e estratégias de métricas"),
        ("generate_seed.mjs", "Gerador auxiliar da carga inicial"),
    ]
    for name, desc in migrations:
        story.append(path_card(PROJECT / "supabase" / name, desc))

    story.extend([
        p("Documentação do projeto", "Subsection"),
        path_card(PROJECT / "INDEX.md", "Visão geral técnica"),
        path_card(PROJECT / "PROJETO_STATUS.md", "Histórico de implementação e publicação"),
        Spacer(1, 5 * mm),
        p("Conclusão", "Section"),
        p("A aplicação está vinculada à conta Vercel <b>taweragt@gmail.com</b>, dentro do time <b>Taiom - claude</b>. O banco utilizado é o projeto Supabase <b>Taiom-austral</b>, referência <b>fcqkdvuqpabuvwfmigzv</b>. A pasta local indicada neste relatório é a origem confirmada do deploy."),
        p("Documento gerado em 19 de setembro de 2026. Auditoria somente de leitura; nenhuma configuração foi alterada.", "Small2"),
    ])

    doc.build(story)
    print(OUTPUT)


if __name__ == "__main__":
    build()
