import { useState } from 'react'
import { WHATSAPP_CONVERSATIONS, BRANCHES } from '../fixtures/branches'
import { useBreakpoint } from '../hooks/useBreakpoint'
import type { WhatsAppMessage, BranchId } from '../types'

export function WhatsAppSim() {
  const { isMobile } = useBreakpoint()
  const [selectedBranch, setSelectedBranch] = useState<BranchId>('centro')

  const conversation = WHATSAPP_CONVERSATIONS.find(c => c.branchId === selectedBranch)
    ?? WHATSAPP_CONVERSATIONS[0]

  return (
    <div>
      <div style={{ marginBottom: isMobile ? 'var(--space-5)' : 'var(--space-6)' }}>
        <div style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-bold)',
          letterSpacing: 'var(--tracking-widest)', textTransform: 'uppercase', color: 'var(--bran)',
          marginBottom: 'var(--space-2)',
        }}>Simulación</div>
        <h1 style={{ fontSize: isMobile ? 'var(--text-2xl)' : 'var(--text-4xl)' }}>WhatsApp · BABKA</h1>
        {!isMobile && (
          <p style={{ marginTop: 'var(--space-2)', color: 'var(--bran)', fontSize: 'var(--text-sm)' }}>
            Así habla BABKA con los gerentes. Vista simulada — sin backend.
          </p>
        )}
      </div>

      {/* Selector */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
        {WHATSAPP_CONVERSATIONS.map(conv => {
          const branch = BRANCHES.find(b => b.id === conv.branchId)!
          const isSelected = conv.branchId === selectedBranch
          return (
            <button
              key={conv.branchId}
              onClick={() => setSelectedBranch(conv.branchId)}
              style={{
                padding: isMobile ? '6px 14px' : '7px 18px',
                borderRadius: 'var(--r-pill)', border: '1.5px solid',
                borderColor: isSelected ? 'var(--babka-blue)' : 'var(--line)',
                background: isSelected ? 'var(--babka-blue)' : 'var(--flour)',
                color: isSelected ? '#fff' : 'var(--ink)',
                fontFamily: 'var(--font-body)',
                fontSize: isMobile ? 'var(--text-xs)' : 'var(--text-sm)',
                fontWeight: 'var(--weight-medium)', cursor: 'pointer',
                transition: 'all var(--transition)',
              }}
            >{branch.shortName}</button>
          )
        })}
      </div>

      {/* Phone */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <PhoneFrame conversation={conversation} isMobile={isMobile} />
      </div>

      {/* Nota */}
      <div style={{
        marginTop: 'var(--space-8)',
        padding: isMobile ? 'var(--space-4)' : 'var(--space-6)',
        background: 'var(--babka-blue-soft)', borderRadius: 'var(--r-lg)',
        maxWidth: '520px', margin: `var(--space-8) auto 0`,
      }}>
        <div style={{
          fontSize: '11px', fontWeight: 'var(--weight-bold)', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--babka-blue-deep)', marginBottom: 'var(--space-3)',
        }}>Cómo funciona en Fase 4</div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--babka-blue-deep)', margin: 0, lineHeight: 1.7 }}>
          El gerente manda mensaje o foto por WhatsApp. BABKA procesa con visión (imagen → inventario JSON),
          valida la aritmética, y cierra solo cuando{' '}
          <code style={{ fontFamily: 'var(--font-mono)' }}>diferencia = 0</code>.
          Si hay descuadre, envía a Revisiones para aprobación.
        </p>
      </div>
    </div>
  )
}

function PhoneFrame({ conversation, isMobile }: {
  conversation: typeof WHATSAPP_CONVERSATIONS[number]; isMobile: boolean
}) {
  const phoneW = isMobile ? 300 : 340

  return (
    <div style={{
      width: `${phoneW}px`,
      background: '#111', borderRadius: '40px', padding: '10px',
      boxShadow: '0 24px 64px rgba(0,0,0,0.35), 0 0 0 2px rgba(255,255,255,0.08)',
    }}>
      {/* Notch */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
        <div style={{ width: '88px', height: '24px', background: '#000', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#222' }} />
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#333' }} />
        </div>
      </div>

      {/* Screen */}
      <div style={{
        background: '#ECE5DD', borderRadius: '28px', overflow: 'hidden',
        height: isMobile ? '520px' : '580px', display: 'flex', flexDirection: 'column',
      }}>
        {/* WA header */}
        <div style={{ background: '#075E54', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%', background: 'var(--wheat)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-black)', fontSize: '15px', color: 'var(--ink)',
          }}>B</div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>BABKA</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>{conversation.contactName}</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c5c5c5' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}>
          {conversation.messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
        </div>

        {/* Input */}
        <div style={{ background: '#F0F0F0', padding: '7px 10px', display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ flex: 1, background: '#fff', borderRadius: '20px', padding: '8px 14px', fontSize: '13px', color: '#999' }}>
            Mensaje
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#075E54', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' }}>
            ↑
          </div>
        </div>
      </div>
    </div>
  )
}

function ChatBubble({ message }: { message: WhatsAppMessage }) {
  const isUser   = message.role === 'user'
  const isSystem = message.role === 'system'

  if (isSystem) return (
    <div style={{ textAlign: 'center', margin: '3px 0' }}>
      <span style={{ background: 'rgba(0,0,0,0.12)', color: '#555', fontSize: '10px', padding: '2px 10px', borderRadius: '10px' }}>
        {message.content}
      </span>
    </div>
  )

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{
        maxWidth: '78%', background: isUser ? '#DCF8C6' : '#fff',
        borderRadius: isUser ? '16px 16px 3px 16px' : '16px 16px 16px 3px',
        padding: '7px 10px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
      }}>
        {message.imageUrl && (
          <div style={{
            width: '140px', height: '88px',
            background: 'linear-gradient(135deg, var(--wheat-light), var(--babka-blue-soft))',
            borderRadius: '10px', marginBottom: '5px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
          }}>📷</div>
        )}
        <div style={{ fontSize: '12.5px', color: '#303030', lineHeight: 1.45, whiteSpace: 'pre-line' }}>
          {message.content}
        </div>
        <div style={{ fontSize: '10px', color: '#999', textAlign: 'right', marginTop: '2px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2px' }}>
          {new Date(message.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}
          {isUser && message.status === 'leido'    && <span style={{ color: '#4FC3F7' }}>✓✓</span>}
          {isUser && message.status === 'recibido' && <span>✓✓</span>}
          {isUser && message.status === 'enviado'  && <span>✓</span>}
        </div>
      </div>
    </div>
  )
}
