import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { t } from '@extension/i18n';

interface ChatInputProps {
  onSendMessage: (text: string, displayText?: string) => void;
  onStopTask: () => void;
  onMicClick?: () => void;
  isRecording?: boolean;
  isProcessingSpeech?: boolean;
  disabled: boolean;
  showStopButton: boolean;
  onPauseTask?: () => void;
  onResumeTask?: () => void;
  isTaskPaused?: boolean;
  setContent?: (setter: (text: string) => void) => void;
  isDarkMode?: boolean;
  // Historical session ID - if provided, shows replay button instead of send button
  historicalSessionId?: string | null;
  onReplay?: (sessionId: string) => void;
  // Mode selector props
  currentMode?: 'agent' | 'plan' | 'ask';
  onModeChange?: (mode: 'agent' | 'plan' | 'ask') => void;
  showModeDropdown?: boolean;
  onToggleModeDropdown?: () => void;
}

// File attachment interface
interface AttachedFile {
  name: string;
  content: string;
  type: string;
}

export default function ChatInput({
  onSendMessage,
  onStopTask,
  onMicClick,
  isRecording = false,
  isProcessingSpeech = false,
  disabled,
  showStopButton,
  onPauseTask,
  onResumeTask,
  isTaskPaused = false,
  setContent,
  isDarkMode = false,
  historicalSessionId,
  onReplay,
  currentMode = 'agent',
  onModeChange,
  showModeDropdown = false,
  onToggleModeDropdown,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const isSendButtonDisabled = useMemo(
    () => disabled || (text.trim() === '' && attachedFiles.length === 0),
    [disabled, text, attachedFiles],
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle text changes and resize textarea
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);

    // Resize textarea
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  };

  // Expose a method to set content from outside
  useEffect(() => {
    if (setContent) {
      setContent(setText);
    }
  }, [setContent]);

  // Initial resize when component mounts
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedText = text.trim();

      if (trimmedText || attachedFiles.length > 0) {
        let messageContent = trimmedText;
        let displayContent = trimmedText;

        // Process user input and file content
        if (attachedFiles.length > 0) {
          const fileContents = attachedFiles
            .map(file => {
              // Tag file content for background service to identify
              return `\n\n<aios_file_content type="file" name="${file.name}">\n${file.content}\n</aios_file_content>`;
            })
            .join('\n');

          // Combine user message with tagged file content (for background service)
          messageContent = trimmedText
            ? `${trimmedText}\n\n<aios_attached_files>${fileContents}</aios_attached_files>`
            : `<aios_attached_files>${fileContents}</aios_attached_files>`;

          // Create display version with only filenames (for UI)
          const fileList = attachedFiles.map(file => `📎 ${file.name}`).join('\n');
          displayContent = trimmedText ? `${trimmedText}\n\n${fileList}` : fileList;
        }

        onSendMessage(messageContent, displayContent);
        setText('');
        setAttachedFiles([]);
      }
    },
    [text, attachedFiles, onSendMessage],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit],
  );

  const handleReplay = useCallback(() => {
    if (historicalSessionId && onReplay) {
      onReplay(historicalSessionId);
    }
  }, [historicalSessionId, onReplay]);

  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: AttachedFile[] = [];
    const allowedTypes = ['.txt', '.md', '.markdown', '.json', '.csv', '.log', '.xml', '.yaml', '.yml'];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();

      // Check if file type is allowed
      if (!allowedTypes.includes(fileExt)) {
        console.warn(`File type ${fileExt} not supported. Only text-based files are allowed.`);
        continue;
      }

      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024) {
        console.warn(`File ${file.name} is too large. Maximum size is 1MB.`);
        continue;
      }

      try {
        const content = await file.text();
        newFiles.push({
          name: file.name,
          content,
          type: file.type || 'text/plain',
        });
      } catch (error) {
        console.error(`Error reading file ${file.name}:`, error);
      }
    }

    if (newFiles.length > 0) {
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleRemoveFile = useCallback((index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-lg border border-white/10 transition-all duration-200 hover:border-white/15 focus-within:border-cyan-500/40"
      aria-label={t('chat_input_form')}>
      <div className="flex flex-col">
        {/* File attachments display */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-white/5 p-3 bg-black/40">
            {attachedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                <span className="text-sm">📎</span>
                <span className="max-w-[150px] truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="ml-1 rounded-full p-1 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                  aria-label={`Remove ${file.name}`}>
                  <span className="text-xs">✕</span>
                </button>
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-disabled={disabled}
          rows={5}
          className="w-full resize-none border-none p-4 bg-transparent text-white placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={attachedFiles.length > 0 ? 'Add a message (optional)...' : t('chat_input_placeholder')}
          aria-label={t('chat_input_editor')}
        />

        <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-t border-white/5">
          <div className="flex gap-3 items-center">
            {/* Mode Selector Dropdown */}
            {onModeChange && onToggleModeDropdown && (
              <div className="relative">
                <button
                  type="button"
                  onClick={onToggleModeDropdown}
                  className="mode-selector-trigger flex items-center gap-1.5 px-2 py-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md text-white text-xs transition-all duration-200"
                  aria-label="Select Mode">
                  <span
                    className={`text-sm ${currentMode === 'agent' ? 'text-cyan-400' : currentMode === 'plan' ? 'text-orange-400' : 'text-white'}`}>
                    {currentMode === 'agent' ? '∞' : currentMode === 'plan' ? '⟳' : '💬'}
                  </span>
                  <span className="font-medium text-xs">
                    {currentMode === 'agent' ? 'Agent' : currentMode === 'plan' ? 'Plan' : 'Ask'}
                  </span>
                  <svg
                    className={`w-3 h-3 text-gray-400 transition-transform ${showModeDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showModeDropdown && (
                  <div className="absolute left-0 bottom-full mb-2 w-40 max-h-48 overflow-y-auto bg-zinc-950 border border-white/10 rounded-lg shadow-2xl z-50">
                    <div className="py-0.5">
                      {currentMode !== 'agent' && (
                        <button
                          type="button"
                          onClick={() => onModeChange('agent')}
                          className="mode-dropdown-item w-full flex items-center gap-1.5 px-2.5 py-1.5 text-left transition-all text-gray-300 hover:bg-gray-700">
                          <span className="text-cyan-400 text-sm">∞</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[11px]">Agent</div>
                            <div className="text-[9px] text-gray-400 truncate">Full automation</div>
                          </div>
                        </button>
                      )}

                      {currentMode !== 'plan' && (
                        <button
                          type="button"
                          onClick={() => onModeChange('plan')}
                          className="mode-dropdown-item w-full flex items-center gap-1.5 px-2.5 py-1.5 text-left transition-all text-gray-300 hover:bg-gray-700">
                          <span className="text-orange-400 text-sm">⟳</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[11px]">Plan</div>
                            <div className="text-[9px] text-gray-400 truncate">Show planning steps</div>
                          </div>
                        </button>
                      )}

                      {currentMode !== 'ask' && (
                        <button
                          type="button"
                          onClick={() => onModeChange('ask')}
                          className="mode-dropdown-item w-full flex items-center gap-1.5 px-2.5 py-1.5 text-left transition-all text-gray-300 hover:bg-gray-700">
                          <span className="text-white text-sm">💬</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-[11px]">Ask</div>
                            <div className="text-[9px] text-gray-400 truncate">Chat only</div>
                          </div>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* File attachment button */}
            <button
              type="button"
              onClick={handleFileSelect}
              disabled={disabled}
              aria-label="Attach files"
              title="Attach text files (txt, md, json, csv, etc.)"
              className="rounded-lg p-2 text-cyan-400 hover:text-white hover:bg-cyan-500/15 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50">
              <span className="text-lg">📎</span>
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.markdown,.json,.csv,.log,.xml,.yaml,.yml"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
            />

            {onMicClick && (
              <button
                type="button"
                onClick={onMicClick}
                disabled={disabled || isProcessingSpeech}
                aria-label={
                  isProcessingSpeech
                    ? t('chat_stt_processing')
                    : isRecording
                      ? t('chat_stt_recording_stop')
                      : t('chat_stt_input_start')
                }
                className={`rounded-lg p-2 transition-all duration-200 ${
                  disabled || isProcessingSpeech
                    ? 'cursor-not-allowed opacity-50'
                    : isRecording
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'text-cyan-400 hover:text-white hover:bg-cyan-500/15'
                }`}>
                {isProcessingSpeech ? (
                  <AiOutlineLoading3Quarters className="size-4 animate-spin" />
                ) : (
                  <FaMicrophone className={`size-4 ${isRecording ? 'animate-pulse' : ''}`} />
                )}
              </button>
            )}
          </div>

          {showStopButton ? (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onStopTask}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-200">
                {t('chat_buttons_stop')}
              </button>
              {isTaskPaused ? (
                <button
                  type="button"
                  onClick={onResumeTask}
                  disabled={!onResumeTask}
                  aria-disabled={!onResumeTask}
                  className={`bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    !onResumeTask ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'
                  }`}>
                  <span className="mr-1">▶</span>
                  {t('chat_buttons_resume')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPauseTask}
                  disabled={!onPauseTask}
                  aria-disabled={!onPauseTask}
                  className={`bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-5 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    !onPauseTask ? 'cursor-not-allowed opacity-50' : 'hover:scale-105'
                  }`}>
                  <span className="mr-1">⏸</span>
                  {t('chat_buttons_pause')}
                </button>
              )}
            </div>
          ) : historicalSessionId ? (
            <button
              type="button"
              onClick={handleReplay}
              disabled={!historicalSessionId}
              aria-disabled={!historicalSessionId}
              className={`bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:scale-105 transition-all duration-200 ${!historicalSessionId ? 'cursor-not-allowed opacity-50' : ''}`}>
              {t('chat_buttons_replay')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSendButtonDisabled}
              aria-disabled={isSendButtonDisabled}
              className={`send-button ${isSendButtonDisabled ? 'cursor-not-allowed opacity-50' : ''}`}>
              {t('chat_buttons_send')}
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
