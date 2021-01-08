# CB-Bot

This is a simple node project for handling Bitrix Livechat messages.

## Localtunnel
I have configured localtunnel to allow for quick and easy localhost development but with a public url that tunnels through to it.

This expires every week so will need to be renewed accordingly.

To install, use

```
npm install -g localtunnel
```
To generate a new public url, use

```
    - lt --port 3000
```

And you will be shown the url to use on the command line.

## Bitrix LiveChat API Documentation
Good luck with this! It is some of the worst documentation I have ever read. However, Bitrix is Russian and so you may find the Russian docs more helpful.

[Here's the English verison](https://training.bitrix24.com/support/training/course/?COURSE_ID=115&INDEX=Y)

## Configuring Livechat in Bitrix
You will need Admin permissions, so please ask if you don't have it.

The configure livechat properly in Bitrix you need to be aware of the following.

### Creating or configuring a Web Widget
This enables and configures the live chat and CRM form widget. You access this as follows.

#### 1. Contact Center
1. In the left menu, click on "Contact Center". It may be in the **More...** section.
2. Find the **Live Chat** item and click. You should see at least one already configured.

#### 2. CRM screens
1. Assumes you have clicked on **CRM** in the left Bitrix menu.
2. Click on **More** dropdown on the top right.
3. Select **Website Widget**.

Then, adjust the configuration as required. You can also configure the **Open Channel** settings here by clicking **configure**.

### Open Channel
This is where you configure the main (but not all) behaviours for the live chat. You can access it

- from the **Web Widget** (above)
- from the **Contact Center** menu, by clicking on the **Live Chat** box.

### Creating the Bot Integration
In order to talk to a Bot server, we need to configure it.

1. In the left menu, click **Developer Resources**/
1. Select **Other** from the list of options.
1. Select **Local Application**.
1. Provide the url of the Bot handler in the first 2 fields.
1. Check the **Script only** box.
1. In the permissions box, add **Creating and managing Chat bots** and **Open Channels**.

As soon as you press save, the Bot server will be called.

### Connecting the Bot
This is done through the Open Channel configuration screens.

1. Click on the **Chat Bots** sub menu item.
2. There is probably one already there, but this is where you attach the Bot integration.

