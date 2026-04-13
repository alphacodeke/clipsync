  (function() {
    const textarea = document.getElementById('textInput');
    const copyButton = document.getElementById('copyButton');
    const statusMessageSpan = document.getElementById('statusMessage');
    const statusAreaDiv = document.getElementById('statusArea');
    const clearBtn = document.getElementById('clearBtn');
    const sampleBtn = document.getElementById('sampleBtn');

    function updateStatus(message, type = 'info') {
      statusMessageSpan.textContent = message;
      
      const iconDiv = statusAreaDiv.querySelector('.status-icon');
      if (type === 'success') {
        iconDiv.innerHTML = '<i class="fas fa-check-circle"></i>';
        statusAreaDiv.style.background = '#e6f7ec';
        statusAreaDiv.style.border = '1px solid #b2e0b2';
        statusAreaDiv.style.color = '#0a3b2a';
      } else if (type === 'error') {
        iconDiv.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        statusAreaDiv.style.background = '#ffe8e6';
        statusAreaDiv.style.border = '1px solid #ffcdca';
        statusAreaDiv.style.color = '#9b2c1d';
      } else {
        iconDiv.innerHTML = '<i class="fas fa-info-circle"></i>';
        statusAreaDiv.style.background = '#f1f5f9';
        statusAreaDiv.style.border = '1px solid #e2edf2';
        statusAreaDiv.style.color = '#1e293b';
      }
      
      
    }
    
    async function copyToClipboard() {
      const textToCopy = textarea.value;
      
      if (textToCopy === "") {
        updateStatus("Nothing to copy — input is empty. Type something first.", "error");
        return false;
      }
      
      try {
        // Use modern clipboard API with fallback for older browsers
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(textToCopy);
          handleCopySuccess(textToCopy);
          return true;
        } else {
          // Fallback for older browsers (using execCommand)
          fallbackCopyText(textToCopy);
          handleCopySuccess(textToCopy);
          return true;
        }
      } catch (err) {
        console.error('Clipboard copy error:', err);
        updateStatus("Copy failed! Check permissions or try again.", "error");
        return false;
      }
    }
    
    function fallbackCopyText(text) {
      const textareaTemp = document.createElement('textarea');
      textareaTemp.value = text;
      textareaTemp.style.position = 'fixed';
      textareaTemp.style.top = '-9999px';
      textareaTemp.style.left = '-9999px';
      textareaTemp.style.opacity = '0';
      document.body.appendChild(textareaTemp);
      textareaTemp.select();
      textareaTemp.setSelectionRange(0, text.length);
      let success = false;
      try {
        success = document.execCommand('copy');
      } catch (err) {
        console.warn('execCommand copy error', err);
      }
      document.body.removeChild(textareaTemp);
      if (!success) {
        throw new Error('execCommand copy failed');
      }
    }
    
    function handleCopySuccess(copiedText) {

      let preview = copiedText;
      if (copiedText.length > 45) {
        preview = copiedText.substring(0, 42) + '...';
      }
      updateStatus(`Copied! “${preview}” is now on your clipboard.`, "success");
      
      copyButton.classList.add('success');
     
      setTimeout(() => {
        copyButton.classList.remove('success');
      }, 1500);
      
      textarea.style.transition = '0.1s';
      textarea.style.borderColor = '#2ecc71';
      setTimeout(() => {
        textarea.style.borderColor = '';
      }, 400);
    }
    
    // clear input field
    function clearInputField() {
      textarea.value = '';
      textarea.focus();
      updateStatus("Input cleared. Ready to copy new text.", "info");
      copyButton.classList.remove('success');
    }
    
    // insert sample demo text
    function insertSampleText() {
      const sampleText = `Hello from ClipSync!\nDeveloped by Anthony Karanja\nYou can copy any text, even multiline.\n Timestamp: ${new Date().toLocaleTimeString()}\nFeel free to edit and copy instantly.`;
      textarea.value = sampleText;
      textarea.focus();
      updateStatus("Sample text inserted — hit copy to test!", "info");
      
      textarea.dispatchEvent(new Event('input'));
      copyButton.classList.remove('success');
    }
    
    // Event listeners
    copyButton.addEventListener('click', (event) => {
      event.preventDefault();
      copyToClipboard();
    });
    
    clearBtn.addEventListener('click', () => {
      clearInputField();
    });
    
    sampleBtn.addEventListener('click', () => {
      insertSampleText();
    });
    
   
    textarea.addEventListener('keydown', (event) => {
      // Ctrl+Enter (or Cmd+Enter on Mac) triggers copy
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        copyToClipboard();
      }
    });
    
    textarea.addEventListener('input', () => {
      const currentMsg = statusMessageSpan.textContent;
      if (currentMsg.includes("empty") || currentMsg.includes("failed") || currentMsg.includes("Nothing to copy")) {
        if (textarea.value.trim() !== "") {
          updateStatus("Ready — new content detected, you can copy now.", "info");
        } else {
          updateStatus("Ready — type something to copy", "info");
        }
      } else if (currentMsg.includes("Copied!")) {
        if (textarea.value !== "") {
          updateStatus("Content changed — ready to copy new text", "info");
        } else {
          updateStatus("Input empty — add text to copy", "info");
        }
      }
      copyButton.classList.remove('success');
    });
    
    textarea.focus();
    
  
    textarea.addEventListener('focus', () => {
    });
    
    if (!navigator.clipboard && !window.isSecureContext) {
      updateStatus("<i class=\"fas fa-exclamation-triangle\"></i> Clipboard API limited: using fallback method. Works fine!", "info");
    } else if (!navigator.clipboard) {
      updateStatus("ℹ <i class=\"fas fa-info-circle\"></i> Using legacy copy method — fully functional.", "info");
    } else {
      
      console.log("Clipboard API ready");
    }
  })();
