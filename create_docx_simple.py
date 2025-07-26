#!/usr/bin/env python3
"""
Simple script to create DOCX from markdown content
Requires: pip install python-docx (if available, otherwise uses basic text formatting)
"""

import os
import re
from datetime import datetime

def create_simple_docx():
    """Create a simple text-based version that can be imported to Word."""
    
    # Read the markdown file
    md_file = 'VPS_DEPLOYMENT_GUIDE.md'
    if not os.path.exists(md_file):
        print(f"❌ File {md_file} không tồn tại!")
        return
    
    with open(md_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Process content for Word-friendly format
    processed_content = process_markdown_content(content)
    
    # Write to RTF format (can be opened by Word)
    rtf_file = 'VPS_DEPLOYMENT_GUIDE.rtf'
    with open(rtf_file, 'w', encoding='utf-8') as f:
        f.write(r'{\rtf1\ansi\deff0 {\fonttbl {\f0 Times New Roman;}}')
        f.write('\n')
        f.write(processed_content)
        f.write('\n}')
    
    print(f"✅ Đã tạo file RTF: {rtf_file}")
    print("📝 File RTF có thể mở bằng Microsoft Word và save as DOCX")
    
    # Also create a clean text version
    txt_file = 'VPS_DEPLOYMENT_GUIDE_FORMATTED.txt'
    with open(txt_file, 'w', encoding='utf-8') as f:
        f.write("=" * 80)
        f.write("\n")
        f.write("🚀 HƯỚNG DẪN DEPLOY THEME EDITOR LÊN VPS".center(80))
        f.write("\n")
        f.write("=" * 80)
        f.write("\n\n")
        f.write(f"📅 Tạo ngày: {datetime.now().strftime('%d/%m/%Y %H:%M')}")
        f.write("\n\n")
        f.write(clean_markdown_for_text(content))
    
    print(f"✅ Đã tạo file TXT: {txt_file}")

def process_markdown_content(content):
    """Process markdown content for RTF format."""
    
    # Convert headings
    content = re.sub(r'^# (.*)', r'\\fs36\\b \1\\b0\\fs24\\par', content, flags=re.MULTILINE)
    content = re.sub(r'^## (.*)', r'\\fs28\\b \1\\b0\\fs24\\par', content, flags=re.MULTILINE)
    content = re.sub(r'^### (.*)', r'\\fs24\\b \1\\b0\\fs24\\par', content, flags=re.MULTILINE)
    
    # Convert code blocks
    content = re.sub(r'```bash\n(.*?)\n```', r'\\f1\\fs20 \1 \\f0\\fs24\\par', content, flags=re.DOTALL)
    content = re.sub(r'```(.*?)\n(.*?)\n```', r'\\f1\\fs20 \2 \\f0\\fs24\\par', content, flags=re.DOTALL)
    
    # Convert inline code
    content = re.sub(r'`([^`]+)`', r'\\f1 \1 \\f0', content)
    
    # Convert bold text
    content = re.sub(r'\*\*(.*?)\*\*', r'\\b \1 \\b0', content)
    
    # Convert line breaks
    content = content.replace('\n', '\\par\n')
    
    return content

def clean_markdown_for_text(content):
    """Clean markdown content for plain text format."""
    
    # Remove markdown syntax
    content = re.sub(r'^#{1,6}\s+', '', content, flags=re.MULTILINE)
    content = re.sub(r'\*\*(.*?)\*\*', r'\1', content)
    content = re.sub(r'\*(.*?)\*', r'\1', content)
    content = re.sub(r'`([^`]+)`', r'\1', content)
    content = re.sub(r'```[\w]*\n(.*?)\n```', r'\1', content, flags=re.DOTALL)
    
    # Clean up extra whitespace
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    return content

def create_word_instructions():
    """Create instructions for manual Word creation."""
    
    instructions = """
📝 HƯỚNG DẪN TẠO DOCX THỦ CÔNG

1. Mở Microsoft Word
2. Tạo document mới
3. Copy nội dung từ file VPS_DEPLOYMENT_GUIDE_FORMATTED.txt
4. Áp dụng formatting:
   - Title: Font 24pt, Bold, Center
   - Headings: Font 18pt, Bold
   - Sub-headings: Font 14pt, Bold
   - Code: Font Consolas 10pt, Background Gray
   - Normal text: Font 12pt

5. Thêm page breaks trước các section chính
6. Save as DOCX format

✅ Hoàn thành!
"""
    
    with open('WORD_CREATION_INSTRUCTIONS.txt', 'w', encoding='utf-8') as f:
        f.write(instructions)
    
    print("📋 Đã tạo hướng dẫn: WORD_CREATION_INSTRUCTIONS.txt")

if __name__ == "__main__":
    print("🚀 Bắt đầu tạo tài liệu VPS Deployment...")
    create_simple_docx()
    create_word_instructions()
    print("\n🎉 Hoàn thành! Bạn có thể:")
    print("1. Mở file RTF bằng Word và save as DOCX")
    print("2. Hoặc copy nội dung từ TXT file vào Word thủ công") 