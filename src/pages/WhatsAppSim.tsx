import { useState } from 'react'
import { WHATSAPP_CONVERSATIONS, BRANCHES } from '../fixtures/branches'
import type { WhatsAppMessage, BranchId } from '../types'

export function WhatsAppSim() {
  const [selectedBranch, setSelectedBranch] = useState<BranchId>('centro')

  const conversation = WHATSAPP_CONVERSATIONS.find(c => c.branchId === selectedBranch)
    ?? WHATSAPP_CONVERSATIONS[0]

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--bran)', marginBottom: 'var(--space-2)',
        }}>
          Simulación
        </div>
        <h1>WhatsApp · BABKA</h1>
        <p style={{ marginTop: 'var(--space-2)', color: 'var(--bran)', fontSize: 'var(--text-sm)' }}>
          Así habla BABKA con los gerentes. Vista simulada — sin backend.
        </p>
      </div>

      {/* Selector de conversación */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {WHATSAPP_CONVERSATIONS.map(conv => {
          const branch = BRANCHES.find(b => b.id === conv.branchId)!
          const isSelected = conv.branchId === selectedBranch
          return (
            <button
              key={conv.branchId}
              onClick={() => setSelectedBranch(conv.branchId)}
              style={{
                padding: '7px 18px',
                borderRadius: 'var(--r-pill)',
                border: '1.5px solid',
                borderColor: isSelected ? 'var(--babka-blue)' : 'var(--line)',
                background: isSelected ? 'var(--babka-blue)' : 'var(--flour)',
                color: isSelected ? '#fff' : 'var(--ink)',
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--text-sm)',
                fontWeight: 'var(--weight-medium)',
                cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
            >
              {branch.shortName}
            </button>
          )
        })}
      </div>

      {/* Marco de teléfono */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PhoneFrame conversation={conversation} />
      </div>

      {/* Nota explicativa */}
      <div style={{
        marginTop: 'var(--space-8)',
        padding: 'var(--space-6)',
        background: 'var(--babka-blue-soft)',
        borderRadius: 'var(--r-lg)',
        maxWidth: '520px',
        margin: 'var(--space-8) auto 0',
      }}>
        <div style={{
          fontSize: '11px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--babka-blue-deep)', marginBottom: 'var(--space-3)',
        }}>
          Cómo funciona en Fase 4
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--babka-blue-deep)', margin: 0, lineHeight: 1.7 }}>
          El gerente manda un mensaje o foto por WhatsApp. BABKA lo procesa con visión (imagen → inventario JSON),
          valida la aritmética, y cierra solo cuando <code style={{ fontFamily: 'var(--font-mono)' }}>diferencia = 0</code>.
          Si hay descuadre, escala a la Bandeja HITL para que Clarisa decida.
        </p>
      </div>
    </div>
  )
}

function PhoneFrame({ conversation }: { conversation: typeof WHATSAPP_CONVERSATIONS[number] }) {
  return (
    <div style={{
      width: '360px',
      background: '#111',
      borderRadius: '44px',
      padding: '12px',
      boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 2px rgba(255,255,255,0.1)',
    }}>
      {/* Notch */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <div style={{ width: '100px', height: '28px', background: '#000', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#222' }} />
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#333' }} />
        </div>
      </div>

      {/* Pantalla WhatsApp */}
      <div style={{
        background: '#ECE5DD',
        borderRadius: '32px',
        overflow: 'hidden',
        height: '620px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header de chat */}
        <div style={{
          background: '#075E54',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <div style={{
            width: '40px', height: '40px',
            borderRadius: '50%',
            background: 'var(--wheat)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)',
            fontSize: '16px', color: 'var(--ink)', flexShrink: 0,
          }}>
            B
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '15px' }}>BABKA</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
              {conversation.contactName}
            </div>
          </div>
        </div>

        {/* Mensajes */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c5c5c5' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}>
          {conversation.messages.map(msg => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
        </div>

        {/* Input simulado */}
        <div style={{
          background: '#F0F0F0',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            flex: 1, background: '#fff', borderRadius: '24px',
            padding: '10px 16px', fontSize: '14px', color: '#999',
          }}>
            Mensaje
          </div>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: '#075E54', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: '18px',
          }}>
            ↑
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatBubble({ message }: { message: WhatsAppMessage }) {
  const isUser = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) {
    return (
      <div style={{ textAlign: 'center', margin: '4px 0' }}>
        <span style={{
          background: 'rgba(0,0,0,0.12)', color: '#555',
          fontSize: '11px', padding: '3px 12px', borderRadius: '12px',
        }}>
          {message.content}
        </span>
      </div>
    )
  }

  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
    }}>
      <div style={{
        maxWidth: '75%',
        background: isUser ? '#DCF8C6' : '#fff',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        padding: '8px 12px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
        position: 'relative',
      }}>
        {/* Imagen simulada */}
        {message.imageUrl && (
          <div style={{
            width: '160px', height: '100px',
            background: 'linear-gradient(135deg, var(--wheat-light), var(--babka-blue-soft))',
            borderRadius: '12px',
            marginBottom: '6px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '28px',
          }}>
            📷
          </div>
        )}

        <div style={{
          fontSize: '13.5px',
          color: '#303030',
          lineHeight: 1.45,
          whiteSpace: 'pre-line',
        }}>
          {message.content}
        </div>

        <div style={{
          fontSize: '10px', color: '#999',
          textAlign: 'right', marginTop: '3px',
          display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '3px',
        }}>
          {formatMsgTime(message.timestamp)}
          {isUser && message.status === 'leido' && <span style={{ color: '#4FC3F7' }}>✓✓</span>}
          {isUser && message.status === 'recibido' && <span>✓✓</span>}
          {isUser && message.status === 'enviado' && <span>✓</span>}
        </div>
      </div>
    </div>
  )
}

function formatMsgTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
}
