Hooks.once("init", () => {

  console.log("Dino Island Module | V14 Ready");

  class DinoSheet extends ActorSheet {

    static get defaultOptions() {
      return foundry.utils.mergeObject(super.defaultOptions, {
        classes: ["dino", "sheet", "actor"],
        template: "modules/dino-island-module/templates/character-sheet.html",
        width: 900,
        height: 750
      });
    }

    activateListeners(html) {
      super.activateListeners(html);

      html.find(".roll-move").on("click", async (event) => {
        event.preventDefault();

        const stat = event.currentTarget.dataset.stat;
        const label = event.currentTarget.dataset.label;

        if (!stat) return;

        await this.rollMove(stat, label);
      });
    }

    async rollMove(stat, label = "Move") {
      const stats = this.actor.system?.stats || {};
      const value = Number(stats[stat]) || 0;

      const roll = await (new Roll(`2d6 + ${value}`)).evaluate();

      // PbtA Ergebnis
      let resultText = "";
      if (roll.total <= 6) resultText = "❌ Miss";
      else if (roll.total <= 9) resultText = "⚠️ Partial Success";
      else resultText = "✅ Success";

      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: `<strong>${this.actor.name}</strong> uses <strong>${label}</strong><br>
                 Stat: ${stat.toUpperCase()} (${value})<br>
                 <h2>${resultText}</h2>`
      });
    }
  }

  Actors.registerSheet("dino-island-module", DinoSheet, {
    types: ["character"],
    makeDefault: false
  });

});
