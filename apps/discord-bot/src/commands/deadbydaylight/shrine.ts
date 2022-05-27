import { SlashCommandBuilder } from '@discordjs/builders';
import { MessageAttachment } from 'discord.js';
import Canvas from 'canvas';
import Path from 'path';
import Fs from 'node:fs';
import Command from '@commands/command';
import Logger from '@common/logger';
import { DeadByDaylight } from '@9head/core-api';

const cacheImage = {
  start: null,
  image: null,
};

export default {
  data: new SlashCommandBuilder()
    .setName('dbd-shrine')
    .setDescription(
      'Visualizar as habilidades que estão no Shrine of Secrets do Dead By Daylight.',
    ),
  async execute(perkName, interaction) {
    async function perkIcon(
      context: any,
      numberPosPerk: 1 | 2 | 3 | 4,
      image: string,
      valueShards: number,
    ) {
      const posPerks = {
        1: { x: 495, y: 12, textX: 395, textY: 515 },
        2: { x: 318, y: 198, textX: 135, textY: 515 },
        3: { x: 680, y: 198, textX: 395, textY: 775 },
        4: { x: 495, y: 382, textX: 135, textY: 775 },
      };

      const directory = Path.join(Path.resolve(), `assets/deadbydaylight/${image}`);
      const contents = Fs.readFileSync(directory);
      const avatar = await Canvas.loadImage(contents);
      context.save();
      context.drawImage(avatar, posPerks[numberPosPerk].x, posPerks[numberPosPerk].y, 250, 250);

      context.font = 'bold 30px sans-serif';
      context.fillStyle = '#ffffff';
      context.translate(100, 100);
      context.rotate(-Math.PI / 4);
      context.textAlign = 'right';
      context.fillText(valueShards, posPerks[numberPosPerk].textX, posPerks[numberPosPerk].textY);

      context.restore();
      Logger.debug(`Gerando a imagem do perk (${image}) para o shrine`);
    }

    try {
      await interaction.deferReply({ ephemeral: true });

      const shrine = await DeadByDaylight.getShire();
      Logger.debug(shrine.data, 'Shrine response API');
      if (cacheImage.start === shrine.start && cacheImage.image !== null) {
        interaction.editReply({ files: [cacheImage.image] });
        Logger.info('A imagem do shrine já foi gerada e está no cache');
        return true;
      }

      const directory = Path.join(Path.resolve(), 'assets/deadbydaylight/shrine-of-secrets.png');
      const contents = Fs.readFileSync(directory);

      const canvas = Canvas.createCanvas(1250, 700);
      const background = await Canvas.loadImage(contents);
      const context = canvas.getContext('2d');

      context.drawImage(background, 0, 0, canvas.width, canvas.height);

      await Promise.all(
        shrine.perks.map(async (perk: any, index: number) => {
          const perkInfo = await DeadByDaylight.perkInfo(perk.id);
          Logger.debug(perkInfo, `Perk (${perk.id}) response API`);
          const pathImage = perkInfo.image.split('/');
          await perkIcon(
            context,
            (index + 1) as 1 | 2 | 3 | 4,
            `UI/Icons/Perks/${pathImage[pathImage.length - 1]}`,
            perk.shards,
          );
        }),
      );

      const attachment = new MessageAttachment(canvas.toBuffer(), 'shrine-of-secrets.png');
      cacheImage.image = attachment as any;
      cacheImage.start = shrine.start;
      interaction.editReply({ files: [attachment] });

      return true;
    } catch (error) {
      interaction.editReply({ content: 'Não foi possivel consultar o shrine.' });
      Logger.error(error);
      return false;
    }
  },
} as Command;
