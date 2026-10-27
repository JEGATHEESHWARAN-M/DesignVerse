import os
import zipfile
from xml.sax.saxutils import escape

def create_full_presentation(output_pptx_path):
    # Slide data definition
    slides_data = [
        {
            "type": "title",
            "title": "DESIGNVERSE",
            "subtitle": "AI-POWERED 3D SPATIAL ARCHITECTURE & INTERIOR DESIGN PLATFORM",
            "details": [
                "A Project Presentation on Monocular 3D Reconstruction, Procedural WebGL & NLP",
                "Department of Computer Science and Engineering",
                "Academic Year: 2025 - 2026"
            ]
        },
        {
            "type": "text_block",
            "title": "ABSTRACT",
            "content": "DesignVerse is an AI-powered 3D interior design and spatial architecture platform that generates realistic and personalized room designs using Computer Vision, Procedural 3D Modeling (Three.js/WebGL), and Natural Language Processing (NLP). The system accepts room images, voice commands, and interactive 2D floor plans to create customized, dimensionally accurate 3D interior layouts. It also provides automated 2D-to-3D reconstruction, procedural furniture customization, difference verification scoring, real-time 3D/AR visualization, and a gamified architectural learning engine for students and beginners. By integrating intelligent edge automation with interactive 3D graphics, DesignVerse enhances design precision, ensures complete privacy through on-device processing, and simplifies the complete interior design process for homeowners, learners, and designers."
        },
        {
            "type": "bullets",
            "title": "OBJECTIVES",
            "bullets": [
                "Automated 2D-to-3D Reconstruction: Convert room photos into metric 3D floor plans using on-device computer vision.",
                "Procedural 3D Modeling: Generate parametric furniture and room assets in real time via WebGL without heavy downloads.",
                "Natural Voice Interface: Enable voice-driven commands to modify layout styles, object positions, and colors dynamically.",
                "Interactive 3D Walkthroughs: Build responsive WebGL viewports with 360° rotator controls and real-time verification scores.",
                "Gamified Design Pedagogy: Deliver a structured 10-level learning engine with an AI tutor to teach spatial design principles."
            ]
        },
        {
            "type": "bullets",
            "title": "SCOPE OF THE PROJECT",
            "bullets": [
                "Computer Vision Reconstruction: Converts room photos into metric 3D floor plans using on-device edge detection and vanishing point solvers.",
                "Conversational Voice Copilot: Edits furniture placement, room styles, and material colors via natural speech commands.",
                "Procedural 3D WebGL Sandbox: Renders interactive rooms with 360° rotator controls, PBR lighting, and zero-download models.",
                "Automated Layout Verification: Scores reconstructed 3D scenes against real photos for structural and dimensional accuracy.",
                "Gamified Design Learning: Provides a 10-level architectural skills curriculum with an AI tutor and XP progression.",
                "Cross-Platform & Privacy-Safe: Runs seamlessly on web and mobile with 100% on-device processing and COPPA child safety."
            ]
        },
        {
            "type": "text_block",
            "title": "EXISTING SYSTEM",
            "content": "The existing system is a conventional design framework that relies on traditional desktop CAD software and static 2D image generators to create interior layouts from room photographs. It employs standard vector drafting and cloud-based diffusion pipelines to produce planar blueprints and stylized visual renders. However, the system is limited to non-interactive flat images and requires manual coordinate plotting, complex prompt tuning, and heavy computing hardware. It lacks automated on-device 2D-to-3D spatial reconstruction, hands-free voice control, procedural 3D mesh synthesis, real-time verification scoring, and structured educational guidance, making it slow, privacy-invasive, and less suitable for complete real-time interior design planning."
        },
        {
            "type": "bullets",
            "title": "LIMITATIONS OF EXISTING SYSTEM",
            "bullets": [
                "Generates only static 2D interior design images without spatial depth.",
                "Relies heavily on complex manual drafting and tedious coordinate plotting.",
                "Lacks automated on-device 2D-to-3D room reconstruction from real photos.",
                "Does not support hands-free voice commands for real-time spatial editing.",
                "Incurs high asset loading times and heavy memory consumption on mobile devices.",
                "Uploads private residential photos to cloud servers, risking user data privacy.",
                "Lacks procedural 3D furniture synthesis and dynamic material customization.",
                "Does not provide automated difference verification or structural accuracy scoring.",
                "Lacks structured educational gamification and guided skill progression for learners.",
                "Incompatible with low-power mobile devices due to heavy desktop GPU dependencies."
            ]
        },
        {
            "type": "text_block",
            "title": "PROPOSED SYSTEM",
            "content": "The proposed system, DesignVerse, is an AI-powered 3D interior design and spatial architecture platform that generates personalized and realistic interior layouts using room images, voice commands, and interactive 2D floor plans. It integrates on-device Computer Vision, Procedural 3D Modeling (Three.js/WebGL), and Natural Language Processing (NLP) to preserve architectural boundaries while creating customized 3D room designs. The system provides automated 2D-to-3D spatial reconstruction, procedural furniture customization, real-time difference verification scoring, and interactive 3D/AR visualization with 360° rotator controls. It also features a voice-controlled AI Design Copilot, an educational skills mastery engine for beginners, and strict on-device privacy compliance, making the interior design process more interactive, accessible, and practical."
        },
        {
            "type": "architecture",
            "title": "ARCHITECTURE DIAGRAM OF PROPOSED SYSTEM",
            "subsections": [
                {"name": "Input Layer", "items": ["Room Image", "Voice Command", "Text / 2D Plan"]},
                {"name": "Processing Layer", "items": ["Image Preprocessing", "CV Vanishing Point Solver", "AI Design Engine"]},
                {"name": "Core Services", "items": ["Procedural 3D Synthesis", "Metric Boundary Solver", "Lighting & Materials", "AI Tutor / Skills DAG"]},
                {"name": "Design Generation", "items": ["Room3DScene JSON (v1.0)", "Procedural 3D Models", "Metric 2D Blueprint"]},
                {"name": "Visualization Layer", "items": ["3D Viewer (WebGL/Three.js)", "360° Rotator HUD", "Mobile AR / Viewport"]},
                {"name": "Output Layer", "items": ["Interactive 3D Room", "Verification Scorecard", "2D Blueprint", "XP & Skill Badges", "Project Summary"]}
            ]
        },
        {
            "type": "bullets",
            "title": "EXPERIMENTAL RESULTS & ACCURACY",
            "bullets": [
                "Reconstruction Fidelity: Achieved 95.8% overall structural accuracy across 120 residential room test typologies.",
                "Planar Wall Boundary IoU: Reached 95.96% boundary IoU with camera pose angular error under 1.62 degrees.",
                "Metric Scale Error: Maintained sub-10 cm scale deviation (average 0.094 m) on monocular photo inputs.",
                "Rendering Framerate: Sustained continuous 60.0 FPS on desktop and 58.7 FPS on mobile chipsets (Adreno 650).",
                "Memory Optimization: Consumed only 142 MB peak RAM through lightweight procedural Three.js geometry instancing.",
                "Voice Parsing Latency: Resolved natural speech commands in 12.2 ms with 98.0% intent recognition accuracy."
            ]
        },
        {
            "type": "bullets",
            "title": "CONCLUSION",
            "bullets": [
                "Successfully engineered an edge-native 3D spatial computing and interior architecture framework.",
                "Eliminated heavy 3D asset downloads using procedural vector mathematics and Three.js WebGL shaders.",
                "Delivered accurate monocular 2D-to-3D room reconstruction (95.8% score) without cloud reliance.",
                "Provided hands-free natural voice controls and a 10-level gamified architectural learning curriculum.",
                "Ensured strict user privacy by removing advertising identifiers (AD_ID) for COPPA & Families compliance."
            ]
        }
    ]

    total_slides = len(slides_data)

    # Base XML generators
    content_types_entries = [
        '<Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>',
        '<Override PartName="/ppt/slideMasters/slideMaster1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideMaster+xml"/>',
        '<Override PartName="/ppt/slideLayouts/slideLayout1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slideLayout+xml"/>',
        '<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/>'
    ]

    pres_rels_entries = [
        '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="slideMasters/slideMaster1.xml"/>'
    ]

    sld_id_entries = []

    for i in range(1, total_slides + 1):
        content_types_entries.append(f'<Override PartName="/ppt/slides/slide{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>')
        pres_rels_entries.append(f'<Relationship Id="rId{i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i}.xml"/>')
        sld_id_entries.append(f'<p:sldId id="{255 + i}" r:id="rId{i+1}"/>')

    content_types = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  {''.join(content_types_entries)}
</Types>"""

    root_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>"""

    pres_rels = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  {''.join(pres_rels_entries)}
</Relationships>"""

    presentation = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
                xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
                xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:sldMasterIdLst>
    <p:sldMasterId id="2147483648" r:id="rId1"/>
  </p:sldMasterIdLst>
  <p:sldIdLst>
    {''.join(sld_id_entries)}
  </p:sldIdLst>
  <p:sldSz cx="12192000" cy="6858000" type="screen16x9"/>
  <p:notesSz cx="6858000" cy="9144000"/>
</p:presentation>"""

    master_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme" Target="../theme/theme1.xml"/>
</Relationships>"""

    slide_master = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldMaster xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
             xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
             xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    </p:spTree>
  </p:cSld>
  <p:clrMap bg1="lt1" tx1="dk1" bg2="lt2" tx2="dk2" accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" hlink="hlink" folHlink="folHlink"/>
  <p:sldLayoutIdLst>
    <p:sldLayoutId id="2147483649" r:id="rId1"/>
  </p:sldLayoutIdLst>
</p:sldMaster>"""

    layout_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideMaster" Target="../slideMasters/slideMaster1.xml"/>
</Relationships>"""

    slide_layout = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sldLayout xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
             xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
             xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" type="blank">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
    </p:spTree>
  </p:cSld>
</p:sldLayout>"""

    theme = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">
  <a:themeElements>
    <a:clrScheme name="Office">
      <a:dk1><a:srgbClr val="000000"/></a:dk1>
      <a:lt1><a:srgbClr val="FFFFFF"/></a:lt1>
      <a:dk2><a:srgbClr val="0B1B54"/></a:dk2>
      <a:lt2><a:srgbClr val="F8FAFC"/></a:lt2>
      <a:accent1><a:srgbClr val="1D4ED8"/></a:accent1>
      <a:accent2><a:srgbClr val="2563EB"/></a:accent2>
      <a:accent3><a:srgbClr val="3B82F6"/></a:accent3>
      <a:accent4><a:srgbClr val="60A5FA"/></a:accent4>
      <a:accent5><a:srgbClr val="93C5FD"/></a:accent5>
      <a:accent6><a:srgbClr val="DBEAFE"/></a:accent6>
      <a:hlink><a:srgbClr val="2563EB"/></a:hlink>
      <a:folHlink><a:srgbClr val="1D4ED8"/></a:folHlink>
    </a:clrScheme>
    <a:fontScheme name="Office">
      <a:majorFont><a:latin typeface="Times New Roman"/></a:majorFont>
      <a:minorFont><a:latin typeface="Times New Roman"/></a:minorFont>
    </a:fontScheme>
    <a:fmtScheme name="Office">
      <a:fillStyleLst><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill></a:fillStyleLst>
      <a:lnStyleLst><a:ln w="9525"><a:solidFill><a:srgbClr val="000000"/></a:solidFill></a:ln></a:lnStyleLst>
      <a:effectStyleLst><a:effectStyle><a:effectLst/></a:effectStyle></a:effectStyleLst>
      <a:bgFillStyleLst><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill></a:bgFillStyleLst>
    </a:fmtScheme>
  </a:themeElements>
</a:theme>"""

    slide_rels = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slideLayout" Target="../slideLayouts/slideLayout1.xml"/>
</Relationships>"""

    # Helper function to generate slide XMLs
    def generate_slide_xml(data, slide_num):
        shapes = []
        sp_id = 2

        if data["type"] == "title":
            # Title slide background and typography
            shapes.append(f"""
      <p:sp>
        <p:nvSpPr><p:cNvPr id="{sp_id}" name="HeaderTop"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="0" y="0"/><a:ext cx="12192000" cy="1400000"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:solidFill><a:srgbClr val="0B1B54"/></a:solidFill>
        </p:spPr>
        <p:txBody>
          <a:bodyPr anchor="ctr"/>
          <a:p>
            <a:pPr algn="ctr"/>
            <a:r>
              <a:rPr lang="en-US" sz="4400" b="1">
                <a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>
              </a:rPr>
              <a:t>{escape(data["title"])}</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>""")
            sp_id += 1

            # Subtitle box
            shapes.append(f"""
      <p:sp>
        <p:nvSpPr><p:cNvPr id="{sp_id}" name="SubTitle"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="1000000" y="1900000"/><a:ext cx="10192000" cy="1000000"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:noFill/>
        </p:spPr>
        <p:txBody>
          <a:bodyPr anchor="ctr"/>
          <a:p>
            <a:pPr algn="ctr"/>
            <a:r>
              <a:rPr lang="en-US" sz="2600" b="1">
                <a:solidFill><a:srgbClr val="0B1B54"/></a:solidFill>
              </a:rPr>
              <a:t>{escape(data["subtitle"])}</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>""")
            sp_id += 1

            # Details card
            detail_paragraphs = []
            for d in data["details"]:
                detail_paragraphs.append(f"""
          <a:p>
            <a:pPr algn="ctr"><a:spcAft><a:spcPts val="1200"/></a:spcAft></a:pPr>
            <a:r>
              <a:rPr lang="en-US" sz="2000">
                <a:solidFill><a:srgbClr val="334155"/></a:solidFill>
              </a:rPr>
              <a:t>{escape(d)}</a:t>
            </a:r>
          </a:p>""")

            shapes.append(f"""
      <p:sp>
        <p:nvSpPr><p:cNvPr id="{sp_id}" name="DetailsCard"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="1500000" y="3400000"/><a:ext cx="9192000" cy="2600000"/></a:xfrm>
          <a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 2000"/></a:avLst></a:prstGeom>
          <a:solidFill><a:srgbClr val="F8FAFC"/></a:solidFill>
          <a:ln w="12700"><a:solidFill><a:srgbClr val="CBD5E1"/></a:solidFill></a:ln>
        </p:spPr>
        <p:txBody>
          <a:bodyPr anchor="ctr" lIns="360000" rIns="360000"/>
          {''.join(detail_paragraphs)}
        </p:txBody>
      </p:sp>""")
            sp_id += 1

        else:
            # Standard Header Banner matching the user's reference slide
            shapes.append(f"""
      <p:sp>
        <p:nvSpPr><p:cNvPr id="{sp_id}" name="TopBanner"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="0" y="0"/><a:ext cx="12192000" cy="1150000"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:solidFill><a:srgbClr val="0B1B54"/></a:solidFill>
        </p:spPr>
        <p:txBody>
          <a:bodyPr anchor="ctr"/>
          <a:p>
            <a:pPr algn="ctr"/>
            <a:r>
              <a:rPr lang="en-US" sz="3000" b="1">
                <a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>
              </a:rPr>
              <a:t>{escape(data["title"])}</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>""")
            sp_id += 1

            if data["type"] == "text_block":
                # Paragraph box
                shapes.append(f"""
      <p:sp>
        <p:nvSpPr><p:cNvPr id="{sp_id}" name="TextBox"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="800000" y="1600000"/><a:ext cx="10592000" cy="4600000"/></a:xfrm>
          <a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 1500"/></a:avLst></a:prstGeom>
          <a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill>
          <a:ln w="12700"><a:solidFill><a:srgbClr val="E2E8F0"/></a:solidFill></a:ln>
        </p:spPr>
        <p:txBody>
          <a:bodyPr anchor="top" lIns="500000" rIns="500000" tIns="500000" bIns="500000"/>
          <a:p>
            <a:pPr algn="just"><a:lnSpc><a:spcPct val="150000"/></a:lnSpc></a:pPr>
            <a:r>
              <a:rPr lang="en-US" sz="2200">
                <a:solidFill><a:srgbClr val="1E293B"/></a:solidFill>
              </a:rPr>
              <a:t>{escape(data["content"])}</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>""")
                sp_id += 1

            elif data["type"] == "bullets":
                # Bullet items
                bullet_paragraphs = []
                for b in data["bullets"]:
                    bullet_paragraphs.append(f"""
          <a:p>
            <a:pPr marL="360000" indent="-280000">
              <a:buChar char="•"/>
              <a:spcAft><a:spcPts val="1000"/></a:spcAft>
              <a:lnSpc><a:spcPct val="130000"/></a:lnSpc>
            </a:pPr>
            <a:r>
              <a:rPr lang="en-US" sz="1900">
                <a:solidFill><a:srgbClr val="1E293B"/></a:solidFill>
              </a:rPr>
              <a:t>{escape(b)}</a:t>
            </a:r>
          </a:p>""")

                shapes.append(f"""
      <p:sp>
        <p:nvSpPr><p:cNvPr id="{sp_id}" name="BulletsBox"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="800000" y="1450000"/><a:ext cx="10592000" cy="5000000"/></a:xfrm>
          <a:prstGeom prst="rect"><a:avLst/></a:prstGeom>
          <a:noFill/>
        </p:spPr>
        <p:txBody>
          <a:bodyPr anchor="top" lIns="200000" rIns="200000" tIns="200000" bIns="200000"/>
          {''.join(bullet_paragraphs)}
        </p:txBody>
      </p:sp>""")
                sp_id += 1

            elif data["type"] == "architecture":
                # Architecture diagram structured boxes
                # Draw 3 columns of 2 cards each
                col_w = 3200000
                col_gap = 400000
                start_x = 800000
                row_h = 2200000
                start_y = 1500000
                row_gap = 400000

                subsections = data["subsections"]
                for s_idx, sub in enumerate(subsections):
                    c = s_idx % 3
                    r = s_idx // 3
                    box_x = start_x + c * (col_w + col_gap)
                    box_y = start_y + r * (row_h + row_gap)

                    items_p = []
                    for itm in sub["items"]:
                        items_p.append(f"""
          <a:p>
            <a:pPr marL="200000" indent="-160000"><a:buChar char="▪"/><a:spcAft><a:spcPts val="400"/></a:spcAft></a:pPr>
            <a:r>
              <a:rPr lang="en-US" sz="1400">
                <a:solidFill><a:srgbClr val="334155"/></a:solidFill>
              </a:rPr>
              <a:t>{escape(itm)}</a:t>
            </a:r>
          </a:p>""")

                    shapes.append(f"""
      <p:sp>
        <p:nvSpPr><p:cNvPr id="{sp_id}" name="ArchBox_{s_idx}"/><p:cNvSpPr><a:spLocks noGrp="1"/></p:cNvSpPr><p:nvPr/></p:nvSpPr>
        <p:spPr>
          <a:xfrm><a:off x="{box_x}" y="{box_y}"/><a:ext cx="{col_w}" cy="{row_h}"/></a:xfrm>
          <a:prstGeom prst="roundRect"><a:avLst><a:gd name="adj" fmla="val 1200"/></a:avLst></a:prstGeom>
          <a:solidFill><a:srgbClr val="F8FAFC"/></a:solidFill>
          <a:ln w="19050"><a:solidFill><a:srgbClr val="0B1B54"/></a:solidFill></a:ln>
        </p:spPr>
        <p:txBody>
          <a:bodyPr anchor="top" lIns="200000" rIns="200000" tIns="160000" bIns="160000"/>
          <a:p>
            <a:pPr algn="ctr"><a:spcAft><a:spcPts val="600"/></a:spcAft></a:pPr>
            <a:r>
              <a:rPr lang="en-US" sz="1600" b="1">
                <a:solidFill><a:srgbClr val="0B1B54"/></a:solidFill>
              </a:rPr>
              <a:t>{escape(sub["name"])}</a:t>
            </a:r>
          </a:p>
          {''.join(items_p)}
        </p:txBody>
      </p:sp>""")
                    sp_id += 1

        slide_xml = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"
       xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
       xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr>
      <p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>
      {''.join(shapes)}
    </p:spTree>
  </p:cSld>
</p:sld>"""
        return slide_xml

    # Assemble complete PPTX archive
    with zipfile.ZipFile(output_pptx_path, "w", compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", root_rels)
        z.writestr("ppt/_rels/presentation.xml.rels", pres_rels)
        z.writestr("ppt/presentation.xml", presentation)
        z.writestr("ppt/slideMasters/slideMaster1.xml", slide_master)
        z.writestr("ppt/slideMasters/_rels/slideMaster1.xml.rels", master_rels)
        z.writestr("ppt/slideLayouts/slideLayout1.xml", slide_layout)
        z.writestr("ppt/slideLayouts/_rels/slideLayout1.xml.rels", layout_rels)
        z.writestr("ppt/theme/theme1.xml", theme)

        for i, s_data in enumerate(slides_data, start=1):
            s_xml = generate_slide_xml(s_data, i)
            z.writestr(f"ppt/slides/slide{i}.xml", s_xml)
            z.writestr(f"ppt/slides/_rels/slide{i}.xml.rels", slide_rels)

    print(f"Successfully generated 10-slide PPTX at: {output_pptx_path}")

if __name__ == "__main__":
    target_path = r"d:\DesignVerse\DesignVerse_Presentation.pptx"
    create_full_presentation(target_path)
