#!/usr/bin/env python3
"""What the research established, and where each claim came from.

Two kinds of evidence, kept apart on purpose:

  TEXT      a quoted description from a wiki page that itself cites a chapter
            or an episode. Reliable for what a thing IS.
  MEASURED  a colour sampled from a published frame with PIL. Reliable for
            what a thing LOOKS like, which no amount of prose gives you.

Nothing in MEASURED ships. The frames were downloaded to a scratch directory,
sampled, and the numbers kept; no image, no trace and no redraw appears in the
artefact or on the site. That is the standing IP rule and it is why this file
holds hex values and source URLs rather than pictures.
"""

WIKI = "https://blackclover.fandom.com/wiki/"

# --------------------------------------------------------------------------
# TEXT. (claim, source label, url)
# --------------------------------------------------------------------------
TEXT = [
    ("asta", "Asta's grimoire is a five-leaf clover grimoire, and it is filthy",
     "\"tattered and filthy, with a black five-leaf clover insignia at the center of "
     "its front cover... largely unseen due to the dirt covering it\"",
     "Black Clover Wiki, Asta", WIKI + "Asta"),
    ("asta", "How a grimoire becomes a five-leaf grimoire",
     "\"the cover of the grimoire turns a darker color and the clover turns black and "
     "develops a fifth leaf\" (cited to ch.198 / ep.115)",
     "Black Clover Wiki, Grimoire", WIKI + "Grimoire"),
    ("asta", "Three, four and five leaves",
     "A three-leaf clover grimoire is common and a four-leaf grimoire is rare: \"a "
     "four-leaf clover grimoire brings good luck and is only received by a truly "
     "exceptional mage\" (ch.1 / ep.1). The fifth leaf is the corrupted one, and it is "
     "the one a devil can inhabit.",
     "Black Clover Wiki, Grimoire", WIKI + "Grimoire"),
    ("asta", "Asta's own colouring",
     "\"emerald green eyes and messy grey hair\"; a black headband with \"the "
     "gold-colored Black Bull insignia\" and \"a red-colored four-pointed star\".",
     "Black Clover Wiki, Asta", WIKI + "Asta"),
    ("asta", "The corrupted arm",
     "\"His arm is black with blood red cragged markings, while his fingers are blood "
     "red with black cragged markings and black fingernails.\" (ch.258)",
     "Black Clover Wiki, Asta", WIKI + "Asta"),
    ("asta", "Black Asta",
     "\"his right arm is covered in black Anti Magic, a black wing sprouts from his "
     "right shoulder, a black horn sprouts from the right side of his head... and his "
     "right eye turns red with the pupil becoming slit-like.\" (ch.97 / ep.63)",
     "Black Clover Wiki, Asta", WIKI + "Asta"),
    ("asta", "Anti-magic is an energy, not a colour",
     "\"an energy that is capable of nullifying other forms of magic... It stems from "
     "the devil connected to Asta's grimoire.\" The wiki never assigns it a hue; the "
     "hue has to be measured off the screen.",
     "Black Clover Wiki, Anti Magic", WIKI + "Anti_Magic"),
    ("asta", "The Demon-Dweller Sword borrows its colour",
     "\"After the sword has absorbed a certain amount of magical power, the black "
     "markings on it start glowing with a color corresponding to the absorbed magic "
     "attribute.\" Cited against six different absorptions, including Yami's Dark "
     "Magic (ch.202) and Lemiel's Light Magic (ch.206).",
     "Black Clover Wiki, Demon-Dweller Sword", WIKI + "Demon-Dweller_Sword"),
    ("asta", "The swords are dirty iron, not polished steel",
     "The Demon-Slayer Sword \"is mostly covered in dirt and scuff marks\"; the "
     "Demon-Destroyer Sword is \"mostly covered in dirt until Licht picks it up and "
     "the dirt falls off to reveal a shiny blade\".",
     "Black Clover Wiki, Demon-Slayer Sword", WIKI + "Demon-Slayer_Sword"),

    ("yami", "Dark Magic pulls things in",
     "\"a rare magic attribute that allows the user to generate and manipulate "
     "darkness... Another trait of Dark Magic is its minor gravitational effect, "
     "drawing in and absorbing other magic, as well as pulling in and immobilizing "
     "people.\" (ch.49 / ep.35)",
     "Black Clover Wiki, Dark Magic", WIKI + "Dark_Magic"),
    ("yami", "Dark Cloaked Dimension Slash",
     "Yamimatoi: Jigengiri, written 闇纏・次元斬り. \"the user "
     "channels darkness into a sword and, with a downward slash, releases that darkness "
     "which flies at the opponent. The slash is able to cut through large clouds of "
     "mana, Spatial Magic, and even space itself.\"",
     "Black Clover Wiki, Dark Cloaked Dimension Slash",
     WIKI + "Dark_Cloaked_Dimension_Slash"),
    ("yami", "Yami's own colouring",
     "\"grey eyes and black hair of medium length\", \"a white A-shirt and black "
     "trousers\", and \"an extra layer of tan leather that covers his outer thighs\". "
     "As captain he wears \"a black banner with the squad's insignia\" whose edges are "
     "tattered, \"seeming to have been ripped off from a bigger banner\".",
     "Black Clover Wiki, Yami Sukehiro", WIKI + "Yami_Sukehiro"),
    ("yami", "The cigarette is canon, not a meme",
     "\"Yami's favorite things are cigarettes, intimidation, and interesting people.\" "
     "Cited to the Volume 1 character profile.",
     "Black Clover Wiki, Yami Sukehiro", WIKI + "Yami_Sukehiro"),
    ("yami", "The official site confirms the register",
     "Magic attribute: Dark. Squad: The Black Bulls Squad Captain. \"a magic swordsman "
     "who uses his muscular physique and magic together in battle\", \"a foreigner from "
     "an eastern country that washed up in the Clover Kingdom\".",
     "Official Black Clover anime site (TV Tokyo / Shueisha)",
     "https://bclover.jp/en/character/yami.php"),

    ("bulls", "The robe is black with gold trim",
     "\"The squad's signature robe is a black mantle with gold trimming and hood. It "
     "has a gold-colored button located at the right-hand side to hold it together, "
     "while the left-hand side displays the squad's insignia.\"",
     "Black Clover Wiki, Black Bull", WIKI + "Black_Bull"),
    ("bulls", "The squad's whole register",
     "\"known for its destructive behavior and has been regarded as the worst squad\"; "
     "they carried minus thirty-one stars. Yami's own description: \"The ones destiny "
     "didn't choose. The ones who got chained down.\" This is the opposite pole from "
     "Golden Dawn, whose 125 stars won the Star Awards Festival.",
     "Black Clover Wiki, Black Bull", WIKI + "Black_Bull"),
    ("bulls", "The headquarters is a ramshackle house in a forest",
     "\"a large, tall house with asymmetric structures... multiple stories with most of "
     "them made of stone and brick... located in a forest within the Common Region.\"",
     "Black Clover Wiki, Black Bull", WIKI + "Black_Bull"),
    ("bulls", "How the community wiki codes the squads",
     "The wiki's own infobox stylesheet sets .BlackBullColors to background #1a1a1a on "
     "#ffffff and .GoldenDawnColors to #daa520 on #000000; the Clover Kingdom is "
     "#506956 on #cf9c3d and devils are #960b2c. Secondary evidence - a fan convention, "
     "not an official palette - but it agrees with the frames.",
     "Black Clover Wiki, MediaWiki:Common.css",
     WIKI.replace("/wiki/", "/wiki/MediaWiki:Common.css")),

    ("kingdom", "Grimoires come from grimoire towers",
     "Grimoires \"are special books made of mana\"; a mage receives one at fifteen at a "
     "grimoire tower, and on the owner's death the book \"immediately returns to the "
     "grimoire tower from which it came\".",
     "Black Clover Wiki, Grimoire", WIKI + "Grimoire"),
    ("kingdom", "The kingdom's three realms",
     "Forsaken Realm, Common Realm and the central Noble Realm: \"Those in the "
     "outermost region are the poorest and weakest and are looked down upon by those "
     "from the inner regions.\" Hage, where Asta gets his grimoire, is in the Forsaken "
     "Realm.",
     "Black Clover Wiki, Clover Kingdom", WIKI + "Clover_Kingdom"),
    ("kingdom", "The site's own name",
     "Haruka Mirai, ハルカミライ, romanised Harukamirai, glossed "
     "\"Faraway Future\" - the first opening theme of the anime, performed by Kankaku "
     "Piero, used for episodes 1 to 13. The domain is harukamirai.engineer and the "
     "site's own nav already prints 遥か未来 beside it.",
     "Black Clover Wiki, Haruka Mirai", WIKI + "Haruka_Mirai"),
]

# --------------------------------------------------------------------------
# MEASURED. (group, frame label, wiki file page, [(role, hex, hsv note)])
# --------------------------------------------------------------------------
MEASURED = [
    ("asta", "Asta's grimoire, the anime frame the wiki uses for it",
     WIKI + "File:Asta_Grimoire.png", [
         ("cover, mottled centre", "#130d0c", "H9 S37 V7"),
         ("the five-leaf stamp", "#0f0809", "H351 S47 V6"),
         ("cover, lit edge", "#352320", "H9 S40 V21"),
         ("crimson smoke, bright", "#9b182c", "H351 S85 V61"),
         ("crimson smoke, deep", "#4d1128", "H337 S78 V30"),
         ("page-edge glow", "#680609", "H358 S94 V41"),
     ]),
    ("asta", "Black Asta, sampled top to bottom",
     WIKI + "File:Black_Asta.png", [
         ("sky, zenith", "#14152e", "H238 S57 V18"),
         ("sky, mid", "#462b54", "H280 S49 V33"),
         ("sky, toward the horizon", "#600913", "H353 S91 V38"),
         ("horizon glow", "#8b3457", "H336 S63 V55"),
         ("ground", "#87161f", "H355 S84 V53"),
         ("flare, upper sky", "#d1905d", "H26 S56 V82"),
     ]),
    ("asta", "Asta's devil arm",
     WIKI + "File:Asta's_devil_arm.png", [
         ("arm, black", "#0a0705", "H24 S50 V4"),
         ("cragged marking, blood red", "#330606", "H0 S88 V20"),
         ("mid tone", "#302220", "H8 S33 V19"),
         ("highlight", "#6e6058", "H22 S20 V43"),
     ]),
    ("yami", "Yami, the anime character sheet",
     WIKI + "File:Yami_anime_profile.png", [
         ("ground, pure black", "#000000", "48.9 per cent of the frame"),
         ("tan leather", "#b6a997", "H35 S17 V71"),
         ("leather, shadowed", "#4c4037", "H26 S28 V30"),
         ("warm dark", "#1f160a", "H34 S68 V12"),
     ]),
    ("yami", "Yami's katana",
     WIKI + "File:Yami's_katana.png", [
         ("blade, cold steel", "#4c5957", "H171 S15 V35"),
         ("blade, shadow", "#1f2e2b", "H168 S33 V18"),
         ("blade, lit", "#687776", "H176 S13 V47"),
         ("edge highlight", "#dbe5e2", "H162 S4 V90"),
     ]),
    ("yami", "Dimension Slash, the game render",
     WIKI + "File:Dimension_Slash_-_Quartet_Knights.png", [
         ("sage green", "#4f614e", "H117 S20 V38"),
         ("khaki", "#837d63", "H49 S24 V51"),
         ("plum, deep", "#26191d", "H342 S34 V15"),
         ("plum, lit", "#773b50", "H339 S50 V47"),
         ("pale sage", "#a9b18c", "H73 S21 V69"),
     ]),
    ("bulls", "The Black Bull insignia",
     WIKI + "File:Black_Bull_Insignia.png", [
         ("black", "#000000", "34.9 per cent of the frame"),
         ("black, warm", "#200d09", "H10 S72 V13"),
         ("trim gold, lit", "#efd9a6", "H42 S31 V94"),
         ("trim gold", "#d2bd90", "H41 S31 V82"),
         ("trim gold, shadowed", "#7d6e59", "H35 S29 V49"),
     ]),
    ("bulls", "The squad robe",
     WIKI + "File:Black_Bull_robe.jpg", [
         ("mantle black", "#1a1919", "H0 S4 V10"),
         ("mantle black, warm cast", "#191617", "H340 S12 V10"),
         ("lining bone", "#e5e3dc", "H47 S4 V90"),
         ("trim, shadowed", "#655b46", "H41 S31 V40"),
     ]),
    ("bulls", "The headquarters in its forest",
     WIKI + "File:Black_Bull_Base.png", [
         ("forest canopy", "#6e7e30", "H72 S62 V49"),
         ("clearing grass", "#585615", "H58 S76 V35"),
         ("olive, lit", "#969948", "H62 S53 V60"),
         ("timber", "#332415", "H30 S59 V20"),
         ("path, sunlit", "#f2c977", "H40 S51 V95"),
     ]),
    ("kingdom", "The grimoire tower at Hage",
     WIKI + "File:Hage_Grimoire_Tower.png", [
         ("tower stone, lit", "#a78b6e", "H31 S34 V65"),
         ("earth bank, ochre", "#bd904b", "H36 S60 V74"),
         ("foliage, sunlit", "#515f1c", "H73 S71 V37"),
         ("grass verge", "#eee762", "H57 S59 V93"),
         ("turret roof, terracotta", "#6b1d17", "H4 S79 V42"),
         ("sky haze", "#e4e3de", "H50 S3 V89"),
     ]),
    ("kingdom", "The base in flight, at night",
     WIKI + "File:Flying_Black_Bull_Base.png", [
         ("night sky, deep", "#181a37", "H236 S56 V22"),
         ("night sky, lit", "#1d1e6b", "H239 S73 V42"),
         ("ultramarine core", "#1e0b96", "H248 S93 V59"),
         ("night, lower", "#0e0f35", "H238 S74 V21"),
     ]),
]

GROUPS = [
    ("asta", "Asta"),
    ("yami", "Yami Sukehiro"),
    ("bulls", "The Black Bulls"),
    ("kingdom", "The Clover Kingdom"),
]

# Claims that could not be verified and are therefore NOT used as design input.
UNVERIFIED = [
    "Any specific rim or edge colour for anti-magic stated as canon. No source "
    "consulted assigns anti-magic a hue at all - the wiki describes it as an energy, "
    "and calls the visible result \"black\". Everything this artefact says about how it "
    "looks is a measurement off a published frame, labelled as such, not a quotation.",
    "The kanji spelling 遥か未来 for the opening theme. The wiki and the "
    "official credits give ハルカミライ in katakana. The kanji is a "
    "common gloss and the site already uses it; it is repeated here as the site's own "
    "wording, not as a citation.",
    "Any official Pantone, style-guide or production palette for the series. None was "
    "found. The frame samples are the closest thing to primary evidence available, and "
    "they carry compression and broadcast grading with them.",
]
