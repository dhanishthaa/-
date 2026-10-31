export default function Atelier() {
  return (
    <section
      id="atelier"
      data-layer="L’Atelier — The art of perfume"
      data-node-id="1-2"
      className="LAtelierTheArtOfPerfume"
      aria-labelledby="atelier-title"
    >
      <div data-layer="Atelier portrait" data-node-id="3-4" className="AtelierPortrait">
        <img
          data-layer="The perfumer’s gesture"
          data-node-id="3-5"
          className="ThePerfumerSGesture"
          src="/assets/3-5.webp"
          alt="A perfumer’s hand composing a fragrance"
          loading="eager"
        />
        <div data-layer="Photograph caption" data-node-id="3-6" className="PhotographCaption">
          <span data-layer="Craft detail" data-node-id="3-7" className="CraftDetail">A STUDY IN SENSATION</span>
          <span data-layer="Photograph index" data-node-id="3-8" className="PhotographIndex">GRASSE, FRANCE — 01</span>
        </div>
      </div>
      <div data-layer="Atelier editorial" data-node-id="3-9" className="AtelierEditorial">
        <div data-layer="Section label" data-node-id="3-10" className="SectionLabel">
          <div data-layer="Chapter" data-node-id="3-11" className="Chapter">
            <span data-layer="Chapter rule" data-node-id="3-12" className="ChapterRule" aria-hidden="true" />
            <span data-layer="Chapter label" data-node-id="3-13" className="ChapterLabel">THE ART OF PERFUME</span>
          </div>
          <span data-layer="Chapter number" data-node-id="3-14" className="ChapterNumber">[ 01 ]</span>
        </div>
        <h2 id="atelier-title" data-layer="Atelier title" data-node-id="3-15" className="AtelierTitle">L’Atelier</h2>
        <div data-layer="Editorial story" data-node-id="3-16" className="EditorialStory">
          <p data-layer="Editorial statement" data-node-id="3-17" className="EditorialStatement">An intimate art.<br />An invisible signature.</p>
          <p data-layer="Atelier description" data-node-id="3-18" className="AtelierDescription">Before a fragrance touches skin, it begins with a gesture. A rare essence. An unexpected accord. The quiet pursuit of something that has never existed before.</p>
          <p data-layer="Craft philosophy" data-node-id="3-19" className="CraftPhilosophy">In our atelier, we compose slowly. By hand, by instinct, and always with emotion.</p>
        </div>
        <a data-layer="Atelier invitation" data-node-id="3-20" className="AtelierInvitation" href="#contact" aria-label="Enter the atelier">
          <span data-layer="Discover the atelier" data-node-id="3-21" className="DiscoverTheAtelier">
            <span data-layer="Invitation label" data-node-id="3-22" className="InvitationLabel">ENTER THE ATELIER</span>
            <img data-layer="Invitation arrow" data-node-id="3-23" className="InvitationArrow" src="/assets/3-23.svg" alt="" aria-hidden="true" />
          </span>
          <span data-layer="Invitation underline" data-node-id="3-24" className="InvitationUnderline" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
