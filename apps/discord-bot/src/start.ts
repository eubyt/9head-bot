import 'reflect-metadata';
import { Collection } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import Fs from 'node:fs';
import Path from 'path';
import Config from '@common/config';
import AutoVoiceChannel from '@module/autoVoiceChannel';
import { startDataSource } from '@9head/database';
import CheckRulesTwitch from '@module/checkRulesTwitch';
import GuildClass from './guild';
import Logger from './common/logger';
import ClientBot from './client';

// Instancia do bot
(async () => {
  const client = new ClientBot();
  const discordRest = new REST({ version: '9' }).setToken(Config.DISCORD_TOKEN);
  const RegisterSlashCommandGuild = async (guild: {
    id: string;
    ownerId: string;
    memberCount: number;
  }) => {
    try {
      await discordRest.put(Routes.applicationGuildCommands(Config.DISCORD_CLIENT_ID, guild.id), {
        body: client.commands.map(command => command.data.toJSON()),
      });
      Logger.info(`Os comando da guilda ${guild.id} foi atualizado com sucesso!`);
    } catch (err) {
      Logger.error(
        err,
        `Ocorreu um erro ao tentar atualizar os Slash Commands do servidor ${guild.id}.`,
      );
    }
  };
  client.commands = new Collection();
  const dirCommand = Path.join(Path.resolve(), Config.IS_DEV ? 'src' : 'dist', 'commands');
  const commandFolders = Fs.readdirSync(dirCommand);
  const AddCommandClientList = (commandsFile: string) =>
    new Promise((resolve, reject) => {
      Logger.debug(`Lendo o arquivo do comando ${commandsFile}`);
      import(`./commands/${commandsFile}`)
        .then(module => {
          const command = module.default;
          client.commands.set(command.data.name, command);
          Logger.info(`Comando ${command.data.name} (${commandsFile}) registrado com sucesso!`);
          resolve(true);
        })
        .catch(err => {
          Logger.error(
            err,
            `Ocorreu um erro ao tentar registrar o comando ${commandsFile}. Verifique o arquivo.`,
          );
          reject(err);
        });
    });

  Logger.info('Iniciando o bot...');
  // Iniciar a conexão com o banco de dados
  try {
    await startDataSource(Config.MONGO_URL);
  } catch (err) {
    Logger.fatal(err);
  }
  // Carregar os comandos do bot

  Logger.info('Carregando os comandos do bot...');
  Logger.debug(`DirCommand: ${dirCommand}`);
  Logger.debug(`Existe ${commandFolders.length} pasta(s) dentro de commands.`);

  // Registrando os comandos do bot
  await (async () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const [, folder] of commandFolders.entries()) {
      if (!folder.includes('.')) {
        Logger.debug(`Carregando a pasta ${folder}`);
        const commandsFiles = Fs.readdirSync(Path.join(dirCommand, folder)).filter(file =>
          file.endsWith(Config.IS_DEV ? '.ts' : '.js'),
        );
        Logger.debug(`Existe ${commandsFiles.length} comando(s) dentro da pasta ${folder}.`);
        // eslint-disable-next-line no-await-in-loop
        await Promise.all(
          commandsFiles.map(async file => {
            await AddCommandClientList(`${folder}/${file}`);
          }),
        );
      }
    }
  })();

  // Evento quando o bot for iniciado
  client.once('ready', async () => {
    Logger.info('A instância do bot foi iniciada com sucesso!');

    const listGuildId = client.guilds.cache.map(guild => ({
      id: guild.id,
      ownerId: guild.ownerId,
      memberCount: guild.memberCount,
      guildClass: guild,
    }));
    Logger.info(`O Bot está em ${listGuildId.length} servidor(es).`);

    listGuildId.forEach(async guild => {
      const guildClass = new GuildClass(guild.guildClass);
      await guildClass.init();
      client.dbGuilds.set(guild.id, guildClass);
      Logger.debug(guild, `informações da guilda #${guild.id}`);
      RegisterSlashCommandGuild(guild);
    });
  });

  // Evento quando o bot entrar em um novo servidor
  client.once('guildCreate', async guild => {
    Logger.info(`O Bot entrou no servidor ${guild.id} (Membros: ${guild.memberCount})`);
    const guildClass = new GuildClass(guild);
    await guildClass.init();
    client.dbGuilds.set(guild.id, guildClass);
    RegisterSlashCommandGuild(guild);
  });

  // Evento quando alguém entra numa chamada
  client.on('voiceStateUpdate', (oldState, newState) => {
    AutoVoiceChannel.event(client, oldState, newState);
  });

  // Evento quando alguém manda mensagem
  client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.guild === null) return;
    const guild = client.dbGuilds.get(message.guild.id);
    if (guild === undefined) return;
    CheckRulesTwitch(guild, message.author);
  });

  // Executar os command slash
  client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    Logger.debug(interaction, 'interactionCreate');
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      Logger.error(
        {
          guildId: interaction.guildId,
          channelId: interaction.channelId,
          userId: interaction.user.id,
        },
        `O comando ${interaction.command} não foi encontrado.`,
        `Verifique se o comando está registrado no arquivo src/commands/${interaction.command}.js`,
      );
      return;
    }
    try {
      Logger.info(
        {
          guildId: interaction.guildId,
          channelId: interaction.channelId,
          userId: interaction.user.id,
        },
        `O usuário ${interaction.user.username}#${interaction.user.discriminator} executou o comando ${interaction.commandName}`,
      );
      await command.execute(client, interaction);
    } catch (err) {
      Logger.error(
        {
          guildId: interaction.guildId,
          channelId: interaction.channelId,
          userId: interaction.user.id,
          err,
        },
        `Ocorreu um erro ao executar o comando ${interaction.commandName}.`,
      );
      await interaction.reply({
        content: `Ocorreu um erro ao executar o comando ${interaction.commandName}.\nEntre em contato com a aquipe do servidor.`,
        ephemeral: true,
      });
    }
  });

  client.login(Config.DISCORD_TOKEN);
})();
