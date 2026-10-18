import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT

def generate_resume(output_path):
    # Page setup: letter size (612 x 792 pt).
    # Margins: 36pt left/right (0.5 in), 30pt top/bottom.
    # Usable width: 540 pt. Usable height: 732 pt.
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=32,
        bottomMargin=30
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=25,
        leading=29,
        textColor=colors.HexColor('#0f172a'),
        alignment=TA_LEFT,
        spaceAfter=3
    )

    headline_style = ParagraphStyle(
        'Headline',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11.5,
        leading=15,
        textColor=colors.HexColor('#0284c7'),
        alignment=TA_LEFT,
        spaceAfter=5
    )

    contact_style = ParagraphStyle(
        'Contact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        alignment=TA_LEFT,
        spaceAfter=7
    )

    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0f172a'),
        textTransform='uppercase',
        spaceBefore=0,
        spaceAfter=3
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.2,
        leading=14.8,
        textColor=colors.HexColor('#334155'),
        alignment=TA_LEFT
    )

    project_title = ParagraphStyle(
        'ProjectTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0f172a')
    )

    skill_label = ParagraphStyle(
        'SkillLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.2,
        leading=14.5,
        textColor=colors.HexColor('#1e293b')
    )

    skill_val = ParagraphStyle(
        'SkillVal',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10.2,
        leading=14.5,
        textColor=colors.HexColor('#334155')
    )

    story = []

    # 1. Header
    story.append(Paragraph("MURARISAI TADEPALLI", title_style))
    story.append(Paragraph("B.Tech CSE–IoT Student &nbsp;|&nbsp; Software Development &nbsp;|&nbsp; AI &amp; Generative AI", headline_style))
    
    contact_text = (
        'Hyderabad, India &nbsp;•&nbsp; '
        '<font color="#0284c7"><b>tmurari2007@gmail.com</b></font> &nbsp;•&nbsp; '
        '<b>9154750615</b> &nbsp;•&nbsp; '
        '<a href="https://www.linkedin.com/in/murarisai-tadepalli-03b66b402"><font color="#0284c7"><u>LinkedIn</u></font></a> &nbsp;•&nbsp; '
        '<a href="https://github.com/tmurari2007-crypto"><font color="#0284c7"><u>GitHub</u></font></a>'
    )
    story.append(Paragraph(contact_text, contact_style))
    story.append(HRFlowable(width="100%", thickness=1.4, color=colors.HexColor('#0284c7'), spaceBefore=0, spaceAfter=8))

    def add_section(name):
        story.append(Paragraph(f"<b>{name}</b>", section_heading))
        story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#cbd5e1'), spaceBefore=2, spaceAfter=7))

    # 2. Professional Summary
    add_section("PROFESSIONAL SUMMARY")
    summary_text = (
        "Second-year Computer Science and Engineering (IoT) undergraduate at VNR VJIET with an interest in "
        "software development, Artificial Intelligence, Generative AI, and backend engineering. Building practical "
        "experience through programming, database-backed applications, AI integration experiments, and IoT prototypes. "
        "Eager to learn emerging technologies, solve real-world problems, and contribute to collaborative projects."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 11))

    # 3. Technical Skills
    add_section("TECHNICAL SKILLS")
    skills_data = [
        [Paragraph("<b>Programming</b>", skill_label), Paragraph("Python, C, Java, JavaScript", skill_val)],
        [Paragraph("<b>Backend &amp; APIs</b>", skill_label), Paragraph("Node.js, Express.js, REST APIs", skill_val)],
        [Paragraph("<b>Databases</b>", skill_label), Paragraph("MongoDB, Mongoose", skill_val)],
        [Paragraph("<b>AI / Generative AI</b>", skill_label), Paragraph("LLMs, RAG, LangChain, Ollama, text embeddings, semantic search", skill_val)],
        [Paragraph("<b>IoT &amp; Tools</b>", skill_label), Paragraph("Arduino Uno, HC-SR04, sensor interfacing, Git/GitHub, VS Code, Postman, Tinkercad", skill_val)],
    ]
    skills_table = Table(skills_data, colWidths=[130, 410])
    skills_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(skills_table)
    story.append(Spacer(1, 11))

    # 4. Projects
    add_section("PROJECTS")

    # Project 1
    story.append(Paragraph("<b>AI-Based Smart Farmer Procurement System</b>", project_title))
    p1_desc = (
        "Developed a prototype focused on digital farmer procurement, including slot booking, booking workflows, "
        "queue management, and farmer/admin access.<br/>"
        "<b>Stack:</b> JavaScript, Node.js, Express.js, MongoDB, HTML/CSS."
    )
    story.append(Paragraph(p1_desc, body_style))
    story.append(Spacer(1, 7))

    # Project 2
    story.append(Paragraph("<b>Ollama-Based Semantic Search &amp; Embedding Integration</b>", project_title))
    p2_desc = (
        "Explored local language-model integration and text embedding generation with Ollama and LangChain; "
        "practiced backend connectivity and API testing for AI-powered information retrieval.<br/>"
        "<b>Stack:</b> JavaScript, Ollama, LangChain, REST APIs."
    )
    story.append(Paragraph(p2_desc, body_style))
    story.append(Spacer(1, 7))

    # Project 3
    story.append(Paragraph("<b>IoT-Based Smart Water Level Detector</b>", project_title))
    p3_desc = (
        "Built an Arduino-based monitoring prototype using an HC-SR04 ultrasonic sensor, LEDs, and a buzzer "
        "to indicate water levels.<br/>"
        "<b>Stack:</b> Arduino Uno, Arduino C/C++, ultrasonic sensor, LEDs, buzzer."
    )
    story.append(Paragraph(p3_desc, body_style))
    story.append(Spacer(1, 11))

    # 5. Education
    add_section("EDUCATION")
    edu_heading = (
        "<b>B.Tech, Computer Science and Engineering – Internet of Things (CSE–IoT)</b>"
    )
    story.append(Paragraph(edu_heading, project_title))
    edu_inst = (
        "VNR Vignana Jyothi Institute of Engineering and Technology (VNR VJIET) &nbsp;|&nbsp; "
        "Second Year &nbsp;|&nbsp; <b>CGPA: 9.5</b>"
    )
    story.append(Paragraph(edu_inst, body_style))
    story.append(Spacer(1, 3))
    grades = (
        "<b>Intermediate:</b> 97.7% &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Class 10:</b> 464/500"
    )
    story.append(Paragraph(grades, body_style))
    story.append(Spacer(1, 11))

    # 6. Activities & Career Focus
    add_section("ACTIVITIES &amp; CAREER FOCUS")
    act_desc = (
        "Interested in hackathons, collaborative prototype development, and continuous coding practice. "
        "<b>Career focus:</b> software development, backend engineering, AI applications, and IoT-based solutions."
    )
    story.append(Paragraph(act_desc, body_style))

    doc.build(story)

if __name__ == '__main__':
    generate_resume("public/resume.pdf")
    import shutil
    shutil.copyfile("public/resume.pdf", "resume.pdf")
    if os.path.exists("dist"):
        shutil.copyfile("public/resume.pdf", "dist/resume.pdf")
    print("Resume generated successfully.")
