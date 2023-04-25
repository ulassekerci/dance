export const ScoreText = ({ score }: { score: string | null }) => {
  const style =
    score === 'Perfect'
      ? { color: '#14FF00', text: 'KUSURSUZ' }
      : score === 'Super'
      ? { color: '#22D3EE', text: 'SÜPER' }
      : score === 'Good'
      ? { color: '#2563EB', text: 'FENA DEĞİL' }
      : score === 'OK'
      ? { color: '#C026D3', text: 'EH İŞTE' }
      : score === 'X'
      ? { color: '#DC2626', text: 'X' }
      : null
  if (!style) return null

  return (
    <>
      <span
        className='block text-4xl text-white font-bold text-center transform -rotate-12 relative'
        style={{
          textShadow: `0px 0px 10px ${style.color}, 0px 0px 10px ${style.color}, 0px 0px 30px ${style.color}, 0px 0px 30px ${style.color}, 0px 0px 30px ${style.color}, 0px 0px 30px ${style.color}`,
        }}
      >
        {style.text}
      </span>
    </>
  )
}
