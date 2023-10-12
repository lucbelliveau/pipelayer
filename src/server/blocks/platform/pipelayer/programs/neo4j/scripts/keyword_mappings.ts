import { type PlatformPipelayerConfiguration } from "../../..";

const s = (_: PlatformPipelayerConfiguration) => {
  return JSON.stringify(`key_phrase	category	generic
  a/h5n1	Infectious Disease - Animal	False
  a/h5n1	Infectious Disease - Human	False
  abrin	Chemical	False
  acariasis	Infectious Disease - Animal	False
  acid	Chemical	True
  acid rain	Biological	False
  acinetobacter infections	Environmental	False
  acquired immunodeficiency syndrome	Infectious Disease - Animal	False
  acquired immunodeficiency syndrome	Infectious Disease - Human	False
  actinomycosis	Other Disease	False
  active fault	Biological	False
  acupuncture	Biological	True
  acute hepatopancreatic necrosis disease	Infectious Disease - Animal	False
  adamsite	Chemical	False
  addict*	Substance Abuse	True
  additives	Product	True
  adenovirus	Infectious Disease - Human	False
  adhesives	Product	True
  advances	Biological	True
  adverse effects	Chemical	True
  adverse effects	Nuclear	True
  adverse effects	Product	True
  aeromonas	Infectious Disease - Animal	False
  aeromonas	Infectious Disease - Human	False
  aeruginosa	Biological	False
  aflatoxin	Product	False
  african horse sickness	Infectious Disease - Animal	False
  african horse sickness virus	Infectious Disease - Human	False
  african swine fever	Infectious Disease - Animal	False
  african swine fever virus	Biological	False
  aftershock	Environmental	False
  agalactia	Infectious Disease - Animal	True
  aid	Environmental	True
  aino disease	Infectious Disease - Animal	False
  aino virus	Infectious Disease - Human	False
  air quality	Environmental	False
  akabane disease	Infectious Disease - Animal	False
  akabane virus	Biological	False
  alcelaphine herpes virus 2	Infectious Disease - Human	False
  alcelaphine herpesvirus 1	Infectious Disease - Human	False
  alcohol	Chemical	False
  alcohol	Product	False
  alcohol	Substance Abuse	False
  alcoholism	Other Disease	False
  alert	Environmental	True
  algae	Environmental	False
  algae	Product	False
  alkhurma hemorrhagic fever	Environmental	False
  alkhurma virus	Infectious Disease - Human	False
  allergenic	Product	True
  allergy	Other Disease	False
  allergy alert	Product	True
  alphavirus	Biological	True
  amantadine	Product	False
  amblyomma hebraeum	Infectious Disease - Human	False
  amblyomma variegatum	Infectious Disease - Human	False
  amebiasis	Infectious Disease - Human	False
  ammonia	Chemical	False
  amphetamine*	Substance Abuse	False
  anaplasma phagocytophilum	Infectious Disease - Human	False
  anaplasmosis	Infectious Disease - Animal	False
  anaplasmosis	Infectious Disease - Human	False
  anasakis	Infectious Disease - Animal	False
  anasakis	Infectious Disease - Human	False
  ancylostoma duodenale	Infectious Disease - Human	False
  ancylostomatidae	Infectious Disease - Human	False
  andes virus	Biological	False
  angiostrongyliasis	Environmental	False
  angiostrongyliasis	Infectious Disease - Animal	False
  angiostrongylus	Infectious Disease - Human	False
  animal	Product	True
  animal feed	Product	True
  anisakis	Infectious Disease - Animal	False
  anisakis	Infectious Disease - Human	False
  anthracis	Biological	False
  anthracnose	Infectious Disease - Animal	False
  anthrax	Infectious Disease - Animal	False
  anthrax	Infectious Disease - Human	False
  antibacterial	Product	False
  antibiotics	Product	False
  antifreeze	Product	False
  antivirals	Product	False
  aparavirus	Infectious Disease - Human	False
  aphanomyces astaci	Infectious Disease - Human	False
  arcanobacterium haemolyticum	Infectious Disease - Human	False
  arcanobacterium haemolyticum infection	Environmental	False
  arenavirus	Biological	True
  argentine hemorrhagic fever	Infectious Disease - Animal	False
  argentine hemorrhagic fever	Infectious Disease - Human	False
  arsenic	Chemical	False
  arsine	Chemical	False
  arthritis	Other Disease	False
  asbestos	Product	False
  ascariasis	Infectious Disease - Animal	False
  ascariasis	Infectious Disease - Human	False
  ascaris	Biological	False
  asian soybean rust	Other Disease	False
  aspergillosis	Other Disease	False
  aspergillus	Infectious Disease - Human	False
  asthma	Other Disease	False
  astrovirus	Biological	True
  astrovirus infection	Environmental	False
  astrovirus mlb2	Infectious Disease - Human	False
  atomic energy	Nuclear	True
  atovaquone	Product	False
  aujeszky's disease	Infectious Disease - Animal	False
  aujeszky's disease virus	Infectious Disease - Human	False
  avalanche	Environmental	False
  avian cholera	Infectious Disease - Animal	False
  avian flu	Infectious Disease - Animal	False
  avian flu	Infectious Disease - Human	False
  avian infectious bronchitis virus	Infectious Disease - Human	False
  avian infectious laryngotracheitis	Infectious Disease - Animal	False
  avian influenza virus	Biological	False
  avian mycoplasmosis	Infectious Disease - Animal	False
  azithromycin	Product	False
  b virus infection	Infectious Disease - Animal	False
  babesia	Infectious Disease - Human	False
  babesia caballi	Infectious Disease - Human	False
  babesiosis	Infectious Disease - Animal	False
  babesiosis	Infectious Disease - Human	False
  bacillus cereus	Infectious Disease - Human	False
  bacillus cereus infection	Environmental	False
  bacteria	Biological	True
  bacterial pneumonia	Environmental	False
  bacterial vaginosis	Environmental	False
  bacteroides fragilis	Infectious Disease - Human	False
  bacteroides infection	Environmental	False
  balantidiasis	Infectious Disease - Human	False
  balantidium coli	Infectious Disease - Human	False
  banned	Product	True
  barium	Chemical	False
  bartonella bacilliformis	Biological	False
  bartonella henselae	Biological	False
  bartonellosis	Infectious Disease - Human	False
  baylisascaris	Infectious Disease - Human	False
  baylisascaris infection	Infectious Disease - Animal	False
  baylisascaris infection	Infectious Disease - Human	False
  bee	Biological	True
  beef	Product	False
  benzene	Chemical	False
  biological agent	Biological	True
  biological weapon	Biological	True
  biomarkers	Biological	True
  birds	Product	False
  bison	Product	False
  bk virus	Infectious Disease - Human	False
  bk virus infection	Environmental	False
  black creek canal virus	Biological	False
  black piedra	Environmental	False
  black scorch virus	Biological	False
  blackleg	Infectious Disease - Animal	False
  blastocystis	Infectious Disease - Human	False
  blastocystosis	Environmental	False
  blastomyces dermatitidis	Infectious Disease - Human	False
  blastomycosis	Environmental	False
  blastomycosis	Other Disease	False
  blizzard	Environmental	False
  blood	Product	False
  blue eye disease	Infectious Disease - Animal	False
  blue-eye paramyxovirus	Infectious Disease - Human	False
  blue-green algae	Environmental	False
  bluetongue	Infectious Disease - Animal	False
  bluetongue virus	Infectious Disease - Human	False
  boar	Product	True
  body parts	Product	True
  boil water	Product	True
  bolivian hemorrhagic fever	Infectious Disease - Animal	False
  bolivian hemorrhagic fever	Infectious Disease - Human	False
  bomb	Chemical	True
  bomb	Nuclear	True
  bomb	Product	True
  bonamia ostrea	Infectious Disease - Human	False
  bonamiosis	Infectious Disease - Animal	False
  bordetella pertussis	Infectious Disease - Human	False
  botulinum	Biological	True
  botulism	Infectious Disease - Animal	False
  botulism	Infectious Disease - Human	False
  bovine	Product	True
  bovine ephemeral fever	Infectious Disease - Animal	False
  bovine tuberculosis	Infectious Disease - Animal	False
  bovine viral diarrhea virus	Infectious Disease - Human	False
  bovine viral diarrhoea	Infectious Disease - Animal	False
  brazilian hemorrhagic fever	Infectious Disease - Animal	False
  brazilian hemorrhagic fever	Infectious Disease - Human	False
  brevetoxin	Biological	False
  bromine	Chemical	False
  bromobenzylcyanide	Chemical	False
  brown stripe downy mildew	Other Disease	False
  brucella abortus	Biological	False
  brucella canis	Biological	False
  brucella melitensis	Biological	False
  brucella suis	Biological	False
  brucellosis	Infectious Disease - Animal	False
  brucellosis	Infectious Disease - Human	False
  brugia malayi	Infectious Disease - Human	False
  brugia timori	Infectious Disease - Human	False
  bubalus bubalis	Infectious Disease - Human	False
  burkholderia	Biological	True
  burkholderia infection	Environmental	False
  burkholderia pseudomallei	Infectious Disease - Human	False
  burnable poison	Chemical	True
  burnable poison	Nuclear	True
  buruli ulcer	Environmental	False
  bush meat	Product	False
  butane	Chemical	False
  cache valley virus	Infectious Disease - Human	False
  cache valley virus disease	Infectious Disease - Animal	False
  calf	Product	True
  calicivirus infection	Environmental	False
  camel	Product	True
  camelpox	Infectious Disease - Animal	False
  camelpox	Infectious Disease - Human	False
  camelpox virus	Biological	False
  campylobacter	Biological	True
  campylobacteriosis	Infectious Disease - Animal	False
  campylobacteriosis	Infectious Disease - Human	False
  cancer	Other Disease	False
  cancer drugs	Product	False
  candida	Infectious Disease - Human	False
  candidiasis	Infectious Disease - Human	False
  capillaria	Infectious Disease - Human	False
  capillariasis	Environmental	False
  caprine arthritis and encephalitis	Infectious Disease - Animal	False
  caprine arthritis encephalitis virus	Infectious Disease - Human	False
  capripox	Infectious Disease - Animal	False
  capripoxvirus	Infectious Disease - Human	False
  carbamates	Chemical	False
  carbon dioxide	Chemical	False
  carbon monoxide	Chemical	False
  cardiovascular diseases	Other Disease	False
  carfentanil	Substance Abuse	False
  caribou	Biological	True
  caribou	Infectious Disease - Animal	True
  caribou	Product	True
  case	Biological	True
  case	Chemical	True
  case	Infectious Disease - Animal	True
  case	Infectious Disease - Human	True
  case	Nuclear	True
  case	Other Disease	True
  cat scratch disease	Infectious Disease - Animal	False
  cat scratch disease	Infectious Disease - Human	False
  catarrhal fever	Infectious Disease - Animal	False
  cellulitis	Environmental	False
  cereal crops	Product	False
  cervid	Product	True
  cesium	Chemical	False
  cesium	Nuclear	False
  chagas disease	Infectious Disease - Animal	False
  chagas disease	Infectious Disease - Human	False
  chancroid	Infectious Disease - Human	False
  chapare hemorrhagic fever	Environmental	False
  chapare hemorrhagic fever	Infectious Disease - Animal	False
  chapare hemorrhagic fever	Infectious Disease - Human	False
  chapare virus	Biological	False
  cheese	Product	False
  chemical	Chemical	True
  chemical cloud	Chemical	True
  chemical gas	Chemical	True
  chemical waste	Chemical	True
  chemical weapon	Chemical	True
  chickenpox	Infectious Disease - Human	False
  chickens	Product	True
  chikungunya	Infectious Disease - Animal	False
  chikungunya	Infectious Disease - Human	False
  chikungunya virus	Biological	False
  chimpanzees	Product	False
  chlamydia	Infectious Disease - Human	False
  chlamydophila pneumoniae	Infectious Disease - Human	False
  chlamydophila pneumoniae infection	Environmental	False
  chlorinated hydrocarbons	Chemical	False
  chlorine	Chemical	False
  chloroacetophenone	Chemical	False
  chlorobenzylidenemalononitrile	Chemical	False
  chlorofluorocarbon	Chemical	False
  chloropicrin	Chemical	False
  cholera	Infectious Disease - Animal	False
  cholera	Infectious Disease - Human	False
  chromoblastomycosis	Environmental	False
  chronic kidney disease of unknown etiology	Other Disease	False
  chronic obstructive pulmonary disease	Other Disease	False
  chronic wasting disease	Infectious Disease - Animal	False
  chrysomya	Biological	True
  chrysomya	Infectious Disease - Human	True
  citrus canker	Other Disease	False
  clam	Product	False
  classical swine fever	Infectious Disease - Animal	False
  classical swine fever virus	Biological	False
  climate change	Biological	True
  climate change	Environmental	True
  clindamycin	Product	False
  clinical trials	Biological	True
  clonorchiasis	Environmental	False
  clostridium	Biological	True
  clostridium botulinum	Infectious Disease - Human	False
  clostridium chauvoei	Infectious Disease - Human	False
  clostridium difficile	Biological	False
  clostridium difficile colitis	Environmental	False
  clostridium perfringens	Biological	False
  clostridium tetani	Infectious Disease - Human	False
  clubroot	Other Disease	False
  cluster	Biological	True
  cluster	Infectious Disease - Animal	True
  cluster	Infectious Disease - Human	True
  cluster	Other Disease	True
  cocaine	Substance Abuse	False
  coccidioides	Biological	True
  coccidioides immitis	Infectious Disease - Human	False
  coccidioides posadasii	Infectious Disease - Human	False
  coccidioidomycosis	Environmental	False
  coccidioidomycosis	Infectious Disease - Animal	False
  coccidioidomycosis	Other Disease	False
  cochliomyia	Infectious Disease - Animal	False
  cochliomyia	Other Disease	False
  colchicine	Chemical	False
  cold wave	Biological	False
  colorado tick fever	Infectious Disease - Animal	False
  colorado tick fever	Infectious Disease - Human	False
  colorado tick fever virus	Infectious Disease - Human	False
  coltivirus	Infectious Disease - Human	False
  coma	Substance Abuse	False
  common cold	Environmental	False
  confirmed	Infectious Disease - Animal	True
  confirmed	Infectious Disease - Human	True
  confirmed	Other Disease	True
  confiscated	Biological	True
  confiscated	Chemical	True
  confiscated	Nuclear	True
  confiscated	Product	True
  congenital rubella syndrome	Other Disease	False
  conjunctivitis	Infectious Disease - Human	False
  contact dermatitis	Other Disease	False
  contagious bovine pleuropneumonia	Infectious Disease - Animal	False
  contagious caprine pleuropneumonia	Infectious Disease - Animal	False
  contagious ecthyma	Infectious Disease - Animal	False
  contagious equine metritis	Infectious Disease - Animal	False
  contagious pustular dermatitis	Infectious Disease - Animal	False
  contaminated	Chemical	True
  contaminated	Environmental	True
  contaminated	Nuclear	True
  contaminated	Product	True
  contracted	Infectious Disease - Animal	True
  contracted	Infectious Disease - Human	True
  contracted	Other Disease	True
  controlled substances	Substance Abuse	False
  copper	Chemical	False
  cornish hen	Product	False
  coronavirus	Biological	False
  corynebacterium diphtheriae	Infectious Disease - Human	False
  cosmetics	Product	False
  counterfeit drugs	Product	False
  covid-19	Infectious Disease - Animal	False
  covid-19	Infectious Disease - Human	False
  covid-19 variants	Infectious Disease - Animal	False
  covid-19 variants	Infectious Disease - Human	False
  cowdria ruminantium	Biological	False
  cowpox	Infectious Disease - Animal	False
  cowpox	Infectious Disease - Human	False
  cowpox virus	Biological	False
  cows	Product	True
  coxiella burnetii	Biological	False
  crayfish plague	Infectious Disease - Animal	False
  creutzfeldt-jacob disease	Infectious Disease - Animal	False
  creutzfeldt-jacob disease	Infectious Disease - Human	False
  crimean-congo haemorrhagic fever	Infectious Disease - Animal	False
  crimean-congo haemorrhagic fever	Infectious Disease - Human	False
  crimean-congo haemorrhagic fever virus	Infectious Disease - Human	False
  crohn's disease	Other Disease	False
  crop failure	Product	True
  crops	Product	False
  cross contamination	Product	True
  crude oil	Chemical	True
  cryptococcosis	Infectious Disease - Animal	False
  cryptococcosis	Infectious Disease - Human	False
  cryptosporidiosis	Infectious Disease - Animal	False
  cryptosporidiosis	Infectious Disease - Human	False
  cryptosporidium	Biological	True
  cutaneous larva migrans	Environmental	False
  cyanide	Chemical	False
  cyanobacteria	Biological	True
  cyanogen chloride	Chemical	False
  cyclone	Environmental	False
  cyclospora	Infectious Disease - Human	False
  cyclospora cayetanensis	Infectious Disease - Human	False
  cyclosporiasis	Infectious Disease - Human	False
  cyprinid herpesvirus	Infectious Disease - Human	False
  cysticercosis	Infectious Disease - Animal	False
  cysticercosis	Infectious Disease - Human	False
  cytomegalovirus	Infectious Disease - Human	False
  cytomegalovirus infection	Environmental	False
  dangerous chemical	Chemical	True
  deaths	Biological	True
  deaths	Chemical	True
  deaths	Environmental	True
  deaths	Infectious Disease - Animal	True
  deaths	Infectious Disease - Human	True
  deaths	Nuclear	True
  deaths	Other Disease	True
  deaths	Product	True
  deer	Biological	True
  deer	Infectious Disease - Animal	True
  deer	Product	True
  defects	Biological	True
  defects	Product	True
  deforestation	Biological	False
  delirium	Substance Abuse	False
  deltamethrin	Chemical	False
  deltamethrin	Product	False
  dengue	Infectious Disease - Animal	False
  dengue	Infectious Disease - Human	False
  dengue shock syndrome	Infectious Disease - Animal	False
  dengue shock syndrome	Infectious Disease - Human	False
  dengue virus	Infectious Disease - Human	False
  depleted uranium	Nuclear	False
  depressant drug*	Substance Abuse	False
  dermatophilosis	Infectious Disease - Animal	False
  desmodesmus	Infectious Disease - Human	False
  desmodesmus infection	Environmental	False
  deuterium	Nuclear	False
  diabetes mellitus	Other Disease	False
  diarrhea	Other Disease	False
  dibenzoxazepine	Chemical	False
  dichloro diphenyl trichloroethane	Chemical	False
  died	Biological	True
  died	Chemical	True
  died	Environmental	True
  died	Infectious Disease - Animal	True
  died	Infectious Disease - Human	True
  died	Nuclear	True
  died	Other Disease	True
  died	Product	True
  dientamoeba fragilis	Infectious Disease - Human	False
  dientamoebiasis	Environmental	False
  diesel	Chemical	True
  diet	Product	True
  dietary supplements	Product	False
  dimethylformamide	Chemical	False
  dioxin	Chemical	False
  diphosgene	Chemical	False
  diphtheria	Infectious Disease - Human	False
  diphyllobothriasis	Environmental	False
  diphyllobothrium	Infectious Disease - Human	False
  distilled mustard	Chemical	False
  dmt	Substance Abuse	False
  dobrava-belgrade virus	Infectious Disease - Human	False
  dog flu	Infectious Disease - Animal	False
  donovanosis	Infectious Disease - Human	False
  dourine	Infectious Disease - Animal	False
  downy mildew	Biological	True
  downy mildew	Other Disease	True
  downy mildew disease	Other Disease	False
  doxycycline	Product	False
  dracunculiasis	Infectious Disease - Animal	False
  dracunculiasis	Infectious Disease - Human	False
  dracunculus medinensis	Infectious Disease - Human	False
  drill	Environmental	True
  drinking water	Product	True
  drought	Environmental	False
  drug approval	Product	True
  duck adenovirus 1	Infectious Disease - Human	False
  duck hepatitis virus	Infectious Disease - Human	False
  duck herpesvirus 1	Infectious Disease - Human	False
  duck virus enteritis	Infectious Disease - Animal	False
  duck virus hepatitis	Infectious Disease - Animal	False
  ducks	Product	False
  dumping	Chemical	True
  dumping	Environmental	True
  dumping	Nuclear	True
  duvenhage virus	Biological	False
  dysaesthesia	Other Disease	False
  dysentery	Infectious Disease - Animal	False
  dysentery	Infectious Disease - Human	False
  e-cigarettes	Substance Abuse	False
  e.coli	Biological	False
  earthquake	Environmental	False
  earthquake hazard	Biological	False
  earthquake risk	Biological	False
  eastern equine encephalitis	Infectious Disease - Animal	False
  eastern equine encephalitis	Infectious Disease - Human	False
  eastern equine encephalitis virus	Infectious Disease - Human	False
  ebola	Infectious Disease - Animal	False
  ebola	Infectious Disease - Human	False
  ebolavirus	Infectious Disease - Human	False
  echinococcosis	Infectious Disease - Animal	False
  echinococcosis	Infectious Disease - Human	False
  echinococcus	Infectious Disease - Human	False
  ecosystem	Biological	True
  ecstasy	Substance Abuse	False
  egg drop syndrome	Infectious Disease - Animal	False
  eggs	Biological	True
  eggs	Product	True
  ehrlichia	Infectious Disease - Human	False
  ehrlichia chaffeensis	Infectious Disease - Human	False
  ehrlichia ewingii	Infectious Disease - Human	False
  ehrlichia muris-like	Infectious Disease - Human	False
  ehrlichiosis	Infectious Disease - Animal	False
  ehrlichiosis	Infectious Disease - Human	False
  electromagnetic field	Nuclear	False
  elisa assay	Biological	True
  elks	Product	False
  emergency plan	Chemical	True
  emergency plan	Environmental	True
  emergency plan	Infectious Disease - Animal	True
  emergency plan	Infectious Disease - Human	True
  emergency plan	Nuclear	True
  emergency plan	Other Disease	True
  emergency preparedness	Biological	True
  emergency preparedness	Environmental	True
  emergency preparedness	Infectious Disease - Animal	True
  emergency preparedness	Infectious Disease - Human	True
  emerging disease	Infectious Disease - Animal	True
  emerging disease	Infectious Disease - Human	True
  emerging disease	Other Disease	True
  encephalitis	Infectious Disease - Animal	True
  encephalitis	Infectious Disease - Human	True
  enriched uranium	Nuclear	False
  entamoeba histolytica	Biological	False
  enterobius	Infectious Disease - Human	False
  enterococcus	Infectious Disease - Human	False
  enterococcus faecalis	Biological	False
  enterococcus infection	Environmental	False
  enterotoxin	Biological	True
  enterovirus	Biological	False
  enterovirus encephalomyelitis	Infectious Disease - Animal	False
  enterovirus infection	Environmental	False
  enzootic bovine leukosis	Infectious Disease - Animal	False
  enzootic pneumonia	Infectious Disease - Animal	False
  enzootic pneumonia	Infectious Disease - Human	False
  epicentre	Environmental	False
  epidemic	Biological	True
  epidemic	Infectious Disease - Animal	True
  epidemic	Infectious Disease - Human	True
  epidemic	Other Disease	True
  epididymitis	Infectious Disease - Animal	False
  epididymitis	Infectious Disease - Human	False
  epizootic	Infectious Disease - Animal	True
  epizootic haematopoietic necrosis virus	Infectious Disease - Human	False
  epizootic hematopoietic necrosis	Infectious Disease - Animal	False
  epizootic hemorrhagic disease	Infectious Disease - Animal	False
  epizootic lymphangitis	Infectious Disease - Animal	False
  epstein-barr virus infection	Environmental	False
  epstein–barr virus	Infectious Disease - Human	False
  equid	Product	False
  equine encephalomyelitis	Infectious Disease - Animal	False
  equine herpesvirus	Infectious Disease - Animal	False
  equine infectious anemia	Infectious Disease - Animal	False
  equine infectious anemia virus	Infectious Disease - Human	False
  equine influenza	Infectious Disease - Animal	False
  equine piroplasmosis	Infectious Disease - Animal	False
  equine viral arteritis	Infectious Disease - Animal	False
  eruption	Environmental	False
  erysipeloid	Infectious Disease - Human	False
  erysipelothrix	Infectious Disease - Human	False
  erysipelothrix infection	Infectious Disease - Animal	False
  erythema infectiosum	Environmental	False
  escherichia coli 0157:h7	Infectious Disease - Animal	False
  ethanol	Chemical	False
  ethylene glycol	Chemical	False
  evacuation	Chemical	True
  evacuation	Environmental	True
  evacuation	Nuclear	True
  everglades virus	Biological	False
  exanthem subitum	Environmental	False
  expired	Chemical	True
  expired	Product	True
  explosion	Chemical	True
  explosion	Nuclear	True
  exposed	Chemical	True
  exposed	Nuclear	True
  exposure	Chemical	True
  exposure	Nuclear	True
  falciparum	Biological	False
  fallout	Nuclear	True
  famine	Environmental	True
  fansidar	Product	False
  fasciola gigantica	Infectious Disease - Human	False
  fasciola hepatica	Infectious Disease - Human	False
  fasciolasis	Environmental	False
  fasciolopsiasis	Environmental	False
  fasciolopsis buski	Infectious Disease - Human	False
  fatal injury	Other Disease	True
  fatal sporadic insomnia	Other Disease	False
  fault	Biological	False
  feline herpesvirus	Infectious Disease - Human	False
  feline spongiform encephalopathy	Infectious Disease - Animal	False
  feline viral rhinotracheitis	Infectious Disease - Animal	False
  fentanyl	Substance Abuse	False
  fentanyl (chm)	Chemical	False
  filariasis	Environmental	False
  filariasis	Infectious Disease - Animal	False
  filariasis	Infectious Disease - Human	False
  filoviridae	Biological	False
  filovirus	Biological	False
  fireworks	Product	False
  fish	Product	True
  fish tank granuloma	Infectious Disease - Animal	False
  fissile material	Nuclear	False
  flame retardants	Product	False
  flash flood	Biological	False
  flesh eating disease	Infectious Disease - Human	False
  flexal virus	Biological	True
  flood	Environmental	False
  flu-like virus	Biological	True
  fluoride	Chemical	False
  fluvialis	Biological	False
  food	Product	True
  food insecurity	Product	True
  food poisoning	Environmental	True
  food poisoning	Other Disease	True
  food production	Product	True
  food safety	Product	True
  food security	Product	True
  food shortage	Product	True
  foot-and-mouth disease	Infectious Disease - Animal	False
  foot-and-mouth disease	Infectious Disease - Human	False
  foreshocks	Biological	False
  forest fire	Biological	False
  four corners virus	Biological	False
  fowl typhoid and pullorum disease	Infectious Disease - Animal	False
  fowls	Product	True
  francisella tularensis	Biological	False
  free-living amebic infection	Environmental	False
  fruits	Product	True
  fuel	Product	True
  fumes	Chemical	True
  fungus	Product	False
  furan	Chemical	False
  furnace	Product	True
  fusarium	Biological	True
  fusobacterium infection	Environmental	False
  gallisepticum	Infectious Disease - Animal	False
  gallisepticum	Infectious Disease - Human	False
  gamma ray	Nuclear	False
  gas gangrene	Infectious Disease - Human	False
  gasoline	Chemical	False
  gasoline	Product	False
  gastroenteritis	Infectious Disease - Human	False
  generic drugs	Product	False
  genetically engineered foods	Product	False
  genocide	Other Disease	True
  geotrichosis	Environmental	False
  geotrichum candidum	Infectious Disease - Human	False
  germ warfare	Biological	True
  germicides	Product	False
  gerstmann-straussler	Other Disease	False
  gerstmann-sträussler-scheinker syndrome	Environmental	False
  getah virus infection	Infectious Disease - Animal	False
  giardia	Biological	True
  giardiasis	Infectious Disease - Animal	False
  giardiasis	Infectious Disease - Human	False
  giardiavirus	Biological	False
  glanders	Infectious Disease - Animal	False
  glanders	Infectious Disease - Human	False
  global warming	Biological	True
  global warming	Environmental	True
  gluten free	Product	True
  glycol	Chemical	False
  gnathostoma	Infectious Disease - Human	False
  gnathostomiasis	Infectious Disease - Human	False
  goats	Infectious Disease - Animal	False
  goats	Product	False
  gonococcal infection	Infectious Disease - Human	False
  gonorrhea	Infectious Disease - Human	False
  gorilla	Product	False
  grimontia hollisae	Biological	False
  group a streptococcal infection	Environmental	False
  group a streptococcus	Biological	True
  group b streptococcal infection	Environmental	False
  group b streptococcus	Biological	True
  guanarito virus	Biological	False
  guillain-barre syndrome	Other Disease	False
  gulf war syndrome	Other Disease	False
  gumboro disease	Infectious Disease - Animal	False
  gyrodactylosis	Infectious Disease - Animal	False
  gyrodactylus salaris	Biological	False
  h10n8	Environmental	False
  h10n8	Infectious Disease - Animal	False
  h10n8 virus	Infectious Disease - Human	False
  h1n1	Infectious Disease - Animal	False
  h1n1	Infectious Disease - Human	False
  h1n1 virus	Infectious Disease - Human	False
  h3n2	Environmental	False
  h3n2	Infectious Disease - Animal	False
  h3n2	Infectious Disease - Human	False
  h3n2 virus	Infectious Disease - Human	False
  h3n8	Infectious Disease - Animal	False
  h3n8 virus	Infectious Disease - Human	False
  h5n1 virus	Infectious Disease - Human	False
  h5n2	Environmental	False
  h5n2	Infectious Disease - Animal	False
  h5n2	Infectious Disease - Human	False
  h5n2 virus	Infectious Disease - Human	False
  h5n8	Environmental	False
  h5n8	Infectious Disease - Animal	False
  h5n8 virus	Infectious Disease - Human	False
  h5n9	Infectious Disease - Animal	False
  h5n9 virus	Infectious Disease - Human	False
  h6n1	Environmental	False
  h6n1 virus	Infectious Disease - Human	False
  h7n3	Environmental	False
  h7n3	Infectious Disease - Animal	False
  h7n3	Infectious Disease - Human	False
  h7n6	Environmental	False
  h7n6	Infectious Disease - Animal	False
  h7n6 virus	Infectious Disease - Human	False
  h7n9	Infectious Disease - Animal	False
  h7n9 virus	Infectious Disease - Human	False
  h9n2	Environmental	False
  h9n2	Infectious Disease - Animal	False
  h9n2 virus	Infectious Disease - Human	False
  haemophilus ducreyi	Biological	False
  haemophilus ducreyi	Infectious Disease - Human	False
  haemophilus influenzae type b	Infectious Disease - Human	False
  hallucination*	Substance Abuse	False
  hallucinogen*	Substance Abuse	False
  halofantrine	Product	False
  hamburgers	Product	False
  hand foot and mouth disease	Infectious Disease - Human	False
  hantaan virus	Biological	False
  hantavirus	Biological	True
  hantavirus pulmonary syndrome	Infectious Disease - Animal	False
  hantavirus pulmonary syndrome	Infectious Disease - Human	False
  haplosporidiosis	Infectious Disease - Animal	False
  hazardous material	Chemical	True
  hazardous material	Nuclear	True
  healthy food	Product	False
  heartland virus	Infectious Disease - Human	False
  heartland virus disease	Environmental	False
  heartwater disease	Infectious Disease - Animal	False
  heartwater disease	Infectious Disease - Human	False
  heat wave	Environmental	False
  heavy metal	Chemical	True
  heavy rain	Environmental	False
  heavy water	Nuclear	True
  helicobacter pylori infection	Environmental	False
  hemolytic uremic syndrome	Infectious Disease - Animal	False
  hemolytic uremic syndrome	Other Disease	False
  hemoptysis	Biological	True
  hemoptysis	Other Disease	True
  hemorrhagic fever	Infectious Disease - Animal	False
  hemorrhagic fever	Infectious Disease - Human	False
  hemorrhagic fever with renal syndrome	Environmental	False
  hemorrhagic septicemia	Infectious Disease - Animal	False
  hendra	Infectious Disease - Animal	False
  hendra virus	Biological	True
  hepatitis	Infectious Disease - Animal	False
  hepatitis	Infectious Disease - Human	False
  hepatitis a	Infectious Disease - Human	False
  hepatitis a virus	Infectious Disease - Human	False
  hepatitis b	Infectious Disease - Human	False
  hepatitis b virus	Infectious Disease - Human	False
  hepatitis c	Infectious Disease - Human	False
  hepatitis c virus	Infectious Disease - Human	False
  hepatitis d	Infectious Disease - Human	False
  hepatitis d virus	Infectious Disease - Human	False
  hepatitis e	Infectious Disease - Human	False
  hepatitis e virus	Infectious Disease - Human	False
  hepatitis f	Infectious Disease - Human	False
  hepatitis f virus	Infectious Disease - Human	False
  hepatitis g	Infectious Disease - Human	False
  hepatitis g virus	Infectious Disease - Human	False
  hepatitis virus	Infectious Disease - Human	False
  herbal ecstasy	Substance Abuse	False
  herbal supplements	Product	False
  herd	Product	True
  heroin	Product	False
  heroin	Substance Abuse	False
  herpes b virus	Infectious Disease - Human	False
  herpes simplex	Environmental	False
  herpes simplex virus	Infectious Disease - Human	False
  herpesvirus	Infectious Disease - Human	False
  histoplasma	Infectious Disease - Human	False
  histoplasma farciminosum	Infectious Disease - Human	False
  histoplasmosis	Infectious Disease - Animal	False
  histoplasmosis	Other Disease	False
  hookworm infection	Environmental	False
  hormonally active agents	Chemical	True
  horse	Product	True
  human bocavirus	Infectious Disease - Human	False
  human bocavirus infection	Environmental	False
  human cases	Biological	True
  human cases	Chemical	True
  human cases	Infectious Disease - Animal	True
  human cases	Infectious Disease - Human	True
  human cases	Nuclear	True
  human cases	Other Disease	True
  human cases	Product	True
  human ehrlichiosis	Environmental	False
  human granulocytic anaplasmosis	Environmental	False
  human granulocytic ehrlichiosis	Infectious Disease - Animal	False
  human granulocytic ehrlichiosis	Infectious Disease - Human	False
  human immunodeficiency virus	Infectious Disease - Human	False
  human immunodeficiency virus infection	Infectious Disease - Human	False
  human metapneumovirus	Infectious Disease - Human	False
  human papillomavirus	Infectious Disease - Human	False
  human papillomavirus infection	Environmental	False
  human parainfluenza virus	Infectious Disease - Human	False
  human parainfluenza virus infection	Environmental	False
  hurricane	Environmental	False
  husbandry	Product	True
  hydrofluoric acid	Chemical	False
  hydrogen	Chemical	False
  hydrogen chloride	Chemical	False
  hydrogen cyanide	Chemical	False
  hydrogen fluoride	Chemical	False
  hydrogen peroxide	Chemical	False
  hymenolepiasis	Environmental	False
  hymenolepis	Infectious Disease - Human	False
  hypertension	Other Disease	False
  hypothermia	Substance Abuse	False
  ibaraki disease	Infectious Disease - Animal	False
  ibaraki virus	Infectious Disease - Human	False
  ichthyophthirius multifiliis	Infectious Disease - Human	False
  illegal	Chemical	True
  illegal	Nuclear	True
  illegal	Product	True
  illicit drugs	Product	False
  immunization	Biological	True
  immunization	Infectious Disease - Animal	True
  immunization	Infectious Disease - Human	True
  infanticide	Other Disease	True
  infected	Infectious Disease - Animal	True
  infected	Infectious Disease - Human	True
  infected	Other Disease	True
  infectious bronchitis	Infectious Disease - Animal	False
  infectious bursal disease virus	Infectious Disease - Human	False
  infectious hematopoietic necrosis	Infectious Disease - Animal	False
  infectious hematopoietic necrosis virus	Infectious Disease - Human	False
  infectious hypodermal and haematopoietic necrosis	Infectious Disease - Animal	False
  infectious mononucleosis	Environmental	False
  infectious myonecrosis	Infectious Disease - Animal	False
  infectious myonecrosis virus	Infectious Disease - Human	False
  infectious protein	Biological	True
  infectious salmon anemia	Infectious Disease - Animal	False
  infest*	Biological	True
  infest*	Infectious Disease - Animal	True
  infest*	Infectious Disease - Human	True
  influenza	Infectious Disease - Animal	False
  influenza	Infectious Disease - Human	False
  influenza a virus	Infectious Disease - Human	False
  influenza virus	Infectious Disease - Human	False
  injections	Biological	True
  injections	Product	True
  insecticides	Product	False
  intoxication	Product	True
  iridium	Chemical	False
  iridium	Nuclear	False
  irradiation	Nuclear	True
  ischemia	Other Disease	False
  isospora belli	Infectious Disease - Human	False
  isosporiasis	Infectious Disease - Human	False
  isotope	Nuclear	True
  israel turkey meningoencephalitis	Infectious Disease - Animal	False
  ixodes scapularis	Biological	False
  jamestown canyon virus	Biological	False
  japanese encephalitis	Infectious Disease - Animal	False
  japanese encephalitis	Infectious Disease - Human	False
  japanese encephalitis virus	Infectious Disease - Human	False
  jaundice	Other Disease	False
  jc virus	Infectious Disease - Human	False
  johne's disease	Infectious Disease - Animal	False
  johne's disease	Infectious Disease - Human	False
  junin virus	Biological	False
  kawasaki disease	Infectious Disease - Human	False
  keratitis	Environmental	False
  kerosine	Product	False
  ketone	Chemical	False
  killed	Chemical	True
  killed	Environmental	True
  killed	Nuclear	True
  killed	Product	True
  kingella kingae	Infectious Disease - Human	False
  kingella kingae infection	Environmental	False
  klebsiella granulomatis	Infectious Disease - Human	False
  koi herpesvirus disease	Infectious Disease - Animal	False
  korean hemorrhagic fever	Infectious Disease - Animal	False
  korean hemorrhagic fever	Infectious Disease - Human	False
  kunjin fever	Infectious Disease - Animal	False
  kunjin fever	Infectious Disease - Human	False
  kunjin virus	Biological	False
  kuru	Infectious Disease - Human	False
  kyasanur forest disease	Infectious Disease - Animal	False
  kyasanur forest disease	Infectious Disease - Human	False
  kyasanur forest disease virus	Biological	False
  la crosse encephalitis	Infectious Disease - Animal	False
  la crosse encephalitis	Infectious Disease - Human	False
  la crosse virus	Infectious Disease - Human	False
  lake	Environmental	True
  lambs	Product	True
  landfill	Biological	True
  landslide	Environmental	False
  lariam	Product	False
  larva migrans	Infectious Disease - Animal	False
  lassa fever	Infectious Disease - Animal	False
  lassa fever	Infectious Disease - Human	False
  lassa virus	Biological	False
  lead	Chemical	False
  leak	Chemical	True
  leak	Environmental	True
  leak	Nuclear	True
  legionella pneumophila	Infectious Disease - Human	False
  legionnaires' disease	Infectious Disease - Human	False
  leishmania	Infectious Disease - Human	False
  leishmaniasis	Infectious Disease - Animal	False
  leishmaniasis	Infectious Disease - Human	False
  leprosy	Other Disease	False
  leptospirosis	Infectious Disease - Animal	False
  leptospirosis	Infectious Disease - Human	False
  lettuce	Product	False
  lewisite	Chemical	False
  liberobacter	Biological	True
  liberobacter	Other Disease	True
  liberobacter	Product	True
  lice	Other Disease	False
  lightning	Biological	False
  listeria	Biological	True
  listeriosis	Infectious Disease - Animal	False
  listeriosis	Infectious Disease - Human	False
  livestock	Product	True
  lobsters	Product	False
  locust	Biological	True
  louping ill	Infectious Disease - Animal	False
  louping ill virus	Infectious Disease - Human	False
  lsa seeds	Substance Abuse	False
  lsd	Chemical	False
  lsd	Substance Abuse	False
  lujo hemorrhagic fever	Environmental	False
  lujo virus	Infectious Disease - Human	False
  lumpy skin disease	Infectious Disease - Animal	False
  lyme disease	Infectious Disease - Animal	False
  lyme disease	Infectious Disease - Human	False
  lymphatic filariasis	Environmental	False
  lymphocytic choriomeningitis	Infectious Disease - Animal	False
  lymphocytic choriomeningitis	Infectious Disease - Human	False
  lymphocytic choriomeningitis virus	Biological	False
  lymphogranuloma venereum	Infectious Disease - Human	False
  lyssa virus	Biological	False
  machupo virus	Biological	False
  macrobrachium rosenbergii	Infectious Disease - Human	False
  macrobrachium rosenbergii nodavirus	Infectious Disease - Human	False
  mad cow disease	Infectious Disease - Animal	False
  mad cow disease	Infectious Disease - Human	False
  madariaga virus	Biological	False
  maedi visna	Infectious Disease - Animal	False
  maedi-visna virus	Infectious Disease - Human	False
  maggots	Infectious Disease - Human	False
  maize	Product	False
  malaria	Infectious Disease - Animal	False
  malaria	Infectious Disease - Human	False
  malarone	Product	False
  malignant catarrhal fever	Infectious Disease - Animal	False
  mammal	Infectious Disease - Animal	True
  marburg haemorrhagic fever	Infectious Disease - Animal	False
  marburg haemorrhagic fever	Infectious Disease - Human	False
  marburg virus	Biological	False
  marijuana	Substance Abuse	False
  marseilles fever	Infectious Disease - Animal	False
  marseilles fever	Infectious Disease - Human	False
  mass destruction	Biological	True
  mass destruction	Chemical	True
  mass destruction	Nuclear	True
  mass gathering	Infectious Disease - Human	False
  mayaro virus	Biological	False
  measles	Infectious Disease - Human	False
  measles virus	Infectious Disease - Human	False
  measure	Infectious Disease - Animal	True
  measure	Infectious Disease - Human	True
  measure	Other Disease	True
  meat	Product	False
  medical cannabis	Substance Abuse	False
  medical devices	Product	True
  medicinal products	Product	True
  mediterranean spotted fever	Infectious Disease - Animal	False
  mediterranean spotted fever	Infectious Disease - Human	False
  melioidosis	Infectious Disease - Animal	False
  melioidosis	Infectious Disease - Human	False
  melioidosis	Other Disease	False
  menangle	Infectious Disease - Animal	False
  menangle virus	Infectious Disease - Human	False
  meningitis	Infectious Disease - Human	False
  mental illness	Other Disease	False
  mercury	Chemical	False
  mers-cov	Environmental	False
  mers-cov	Infectious Disease - Human	False
  mescaline	Substance Abuse	False
  metagonimiasis	Environmental	False
  methamphetamine	Substance Abuse	False
  methanol	Chemical	False
  methicillin-resistant staphylococcus aureus	Biological	False
  methyl bromide	Chemical	False
  methyl isocyanate	Chemical	False
  microcephaly	Other Disease	False
  microcystin-lr	Biological	False
  microsporidia infection	Infectious Disease - Human	False
  mikrocytosis	Infectious Disease - Animal	False
  milk	Product	False
  ministry of health	Biological	True
  ministry of health	Chemical	True
  ministry of health	Environmental	True
  ministry of health	Infectious Disease - Animal	True
  ministry of health	Infectious Disease - Human	True
  ministry of health	Nuclear	True
  ministry of health	Other Disease	True
  ministry of health	Product	True
  missile	Biological	True
  missile	Chemical	True
  missile	Nuclear	True
  missing	Chemical	True
  missing	Nuclear	True
  mokola virus	Biological	False
  mollusc	Product	False
  molluscum contagiosum	Environmental	False
  molluscum contagiosum virus	Infectious Disease - Human	False
  monkey pox	Infectious Disease - Animal	False
  monkey pox	Infectious Disease - Human	False
  monkeypox virus	Infectious Disease - Human	False
  monkeys	Product	False
  monsoon	Environmental	False
  moose	Product	False
  morphine	Substance Abuse	False
  mosquito	Biological	True
  mucambo fever	Infectious Disease - Animal	False
  mucambo fever	Infectious Disease - Human	False
  mucambo virus	Biological	False
  mumps	Infectious Disease - Human	False
  mushroom cloud	Nuclear	False
  mussel	Product	False
  mustard	Chemical	False
  mustard gas	Chemical	False
  mycetoma	Environmental	False
  mycobacteriosis	Infectious Disease - Animal	False
  mycobacterium avium	Infectious Disease - Human	False
  mycobacterium leprae	Infectious Disease - Human	False
  mycobacterium paratuberculosis	Infectious Disease - Human	False
  mycobacterium ulcerans	Infectious Disease - Human	False
  mycoplasma	Infectious Disease - Human	False
  mycoplasma gallisepticum	Infectious Disease - Human	False
  mycoplasma mycoides	Biological	False
  mycoplasma pneumonia	Environmental	False
  mycoplasma pneumoniae	Infectious Disease - Human	False
  mycoplasmosis	Infectious Disease - Animal	False
  mycotoxin	Biological	False
  myiasis	Infectious Disease - Animal	False
  myiasis	Infectious Disease - Human	False
  myocardial infarction	Other Disease	False
  mysterious disease	Infectious Disease - Animal	False
  mysterious disease	Infectious Disease - Human	False
  mysterious disease	Other Disease	False
  mysterious substance	Biological	True
  mysterious substance	Chemical	True
  mysterious substance	Nuclear	True
  myxomatosis	Infectious Disease - Animal	False
  naegleria fowleri	Infectious Disease - Human	False
  nairobi sheep disease	Infectious Disease - Animal	False
  naphtha	Chemical	False
  natural disaster	Environmental	True
  natural gas	Chemical	False
  necator americanus	Infectious Disease - Human	False
  necrosis	Other Disease	True
  necrotising hepatopancreatitis	Infectious Disease - Animal	False
  neethling virus	Infectious Disease - Human	False
  negative results	Infectious Disease - Animal	True
  negative results	Infectious Disease - Human	True
  negative results	Other Disease	True
  neisseria	Biological	False
  neisseria gonorrhoeae	Biological	False
  neonatal conjunctivitis	Environmental	False
  nephropathia epidemica	Infectious Disease - Animal	False
  nephropathia epidemica	Infectious Disease - Human	False
  nerve gas	Chemical	False
  neurotoxin	Biological	True
  neurotoxin	Chemical	True
  neutron	Nuclear	False
  new disease	Infectious Disease - Animal	True
  new disease	Infectious Disease - Human	True
  new disease	Other Disease	True
  new psychoactive substances (nps)	Chemical	False
  new psychoactive substances (nps)	Substance Abuse	False
  new strain	Biological	True
  new strain	Infectious Disease - Animal	True
  new strain	Infectious Disease - Human	True
  new strain	Other Disease	True
  new world screwworm	Infectious Disease - Animal	False
  new world screwworm	Other Disease	False
  newcastle disease	Infectious Disease - Animal	False
  nicotine	Chemical	False
  nipah	Infectious Disease - Animal	False
  nipah virus	Biological	False
  nitric acid	Chemical	False
  nitrite	Chemical	False
  nitrogen mustard	Chemical	False
  nocardia	Infectious Disease - Human	False
  nocardiosis	Infectious Disease - Human	False
  non hepatitis a	Infectious Disease - Human	False
  non hepatitis b	Infectious Disease - Human	False
  non hepatitis c	Infectious Disease - Human	False
  non hepatitis d	Infectious Disease - Human	False
  non hepatitis e	Infectious Disease - Human	False
  non hepatitis f	Infectious Disease - Human	False
  non hepatitis g	Infectious Disease - Human	False
  nootropic	Substance Abuse	False
  norovirus	Infectious Disease - Human	False
  norovirus disease	Infectious Disease - Human	False
  norwalk virus	Biological	False
  norwalk virus	Infectious Disease - Human	False
  nosocomial infection	Infectious Disease - Human	False
  nucl	None	False
  nuclear	Nuclear	True
  nuclear device	Nuclear	True
  nuclear fission	Nuclear	True
  nuclear fuel	Nuclear	True
  nuclear fusion	Nuclear	True
  nuclear missile	Nuclear	True
  nuclear warhead	Nuclear	True
  nutrients	Product	True
  o'nyong-nyong virus	Biological	False
  o'nyong-nyong virus disease	Infectious Disease - Human	False
  ockelbo disease	Infectious Disease - Animal	False
  ockelbo disease	Infectious Disease - Human	False
  ockelbo virus	Biological	False
  old world screwworm	Infectious Disease - Animal	False
  omsk hemorrhagic fever	Infectious Disease - Animal	False
  omsk hemorrhagic fever	Infectious Disease - Human	False
  omsk hemorrhagic fever virus	Infectious Disease - Human	False
  onchocerca	Infectious Disease - Human	False
  onchocerca volvulus	Infectious Disease - Human	False
  onchocerciasis	Environmental	False
  onchocerciasis	Infectious Disease - Animal	False
  onchocerciasis	Infectious Disease - Human	False
  oncorhynchus masou virus	Infectious Disease - Human	False
  oncorhynchus masou virus disease	Infectious Disease - Animal	False
  opioid	Substance Abuse	False
  opioid (chm)	Chemical	False
  opioid-induced hyperalgesia	Substance Abuse	False
  opisthorchiasis	Environmental	False
  opisthorchis	Infectious Disease - Human	False
  orbivirus	Infectious Disease - Human	False
  orf virus	Infectious Disease - Human	False
  organic foods	Product	True
  organic solvent	Chemical	True
  organophosphate	Chemical	False
  organophosphorus pesticide	Product	False
  oropouche fever	Environmental	False
  oropouche virus	Infectious Disease - Human	False
  orphan drugs	Product	True
  osmium tetroxide	Chemical	False
  osteoporosis	Other Disease	False
  outbreak	Infectious Disease - Animal	True
  outbreak	Infectious Disease - Human	True
  outbreak	Other Disease	True
  over-the-counter drugs	Product	False
  overdose	Substance Abuse	False
  ovine	Product	False
  ovine herpes virus 2	Infectious Disease - Human	False
  ovine pulmonary adenomatosis	Infectious Disease - Animal	False
  ovine pulmonary adenomatosis virus	Infectious Disease - Human	False
  oxygen	Chemical	False
  oxygen	Product	False
  oysters	Product	False
  ozone	Biological	False
  pain killers	Product	False
  pain killers	Substance Abuse	False
  paint	Product	False
  paludrine	Product	False
  palytoxin	Biological	True
  pandemic	Infectious Disease - Human	True
  pandemic	Other Disease	True
  paracoccidioides brasiliensis	Infectious Disease - Human	False
  paracoccidioidomycosis	Environmental	False
  parafilaria bovicola	Infectious Disease - Human	False
  parafilariasis	Infectious Disease - Animal	False
  paragonimiasis	Infectious Disease - Animal	False
  paragonimiasis	Infectious Disease - Human	False
  paragonimus	Infectious Disease - Human	False
  parahaemolyticus	Infectious Disease - Animal	False
  parahaemolyticus	Infectious Disease - Human	False
  paralysis	Other Disease	True
  paramyxoviridae	Biological	True
  parapox virus	Infectious Disease - Human	False
  parasitemia	Infectious Disease - Human	False
  parasitosis	Biological	True
  paratyphoid fever	Infectious Disease - Animal	False
  paratyphoid fever	Infectious Disease - Human	False
  partridge	Product	False
  parvovirus b19	Environmental	False
  parvovirus b19	Infectious Disease - Human	False
  pasteurella	Infectious Disease - Human	False
  pasteurella multocida	Infectious Disease - Human	False
  pasteurellosis	Environmental	False
  pasteurellosis	Infectious Disease - Animal	False
  pathogen	Biological	True
  pcp	Substance Abuse	False
  perfluorooctanoic acid	Chemical	False
  perishable food	Product	True
  permanganate	Chemical	False
  permethrin	Product	False
  pertussis	Biological	False
  pertussis	Infectious Disease - Human	False
  peste des petits ruminants	Infectious Disease - Animal	False
  peste des petits ruminants	Other Disease	False
  peste des petits ruminants virus	Biological	False
  pesticides	Product	False
  peyote	Substance Abuse	False
  pheasant	Product	False
  phenethylamine*	Substance Abuse	False
  phenylketonuria	Other Disease	False
  phosgene	Chemical	False
  phosgene oxime	Chemical	False
  phosphine	Chemical	False
  phosphorus	Chemical	False
  picornavirus	Infectious Disease - Human	False
  piedraia hortae	Infectious Disease - Human	False
  pigs	Product	True
  pinworm infection	Infectious Disease - Animal	False
  pinworm infection	Infectious Disease - Human	False
  plague	Infectious Disease - Animal	False
  plague	Infectious Disease - Human	False
  plague, bubonic	Infectious Disease - Animal	False
  plague, bubonic	Infectious Disease - Human	False
  plague, meningitis	Infectious Disease - Animal	False
  plague, meningitis	Infectious Disease - Human	False
  plague, ocular	Infectious Disease - Animal	False
  plague, ocular	Infectious Disease - Human	False
  plague, pharyngitis	Infectious Disease - Animal	False
  plague, pharyngitis	Infectious Disease - Human	False
  plague, pneumonic	Infectious Disease - Animal	False
  plague, pneumonic	Infectious Disease - Human	False
  plague, septicemic	Infectious Disease - Animal	False
  plague, septicemic	Infectious Disease - Human	False
  plan	Environmental	True
  plant	Product	True
  plant disease	Other Disease	False
  plaquenil	Other Disease	False
  plaquenil	Product	False
  plasmodial slime mold	Biological	True
  plasmodium	Biological	True
  plastics	Product	False
  plesiomonas shigelloides	Biological	False
  plum pox	Other Disease	False
  plum pox virus	Biological	True
  plutonium	Nuclear	False
  pneumococcal infection	Environmental	False
  pneumocystis	Infectious Disease - Human	False
  pneumocystis pneumonia	Environmental	False
  pneumonia	Infectious Disease - Human	False
  poison	Chemical	True
  poison	Environmental	True
  poison gas	Chemical	True
  poisoned	Chemical	True
  poisoned	Environmental	True
  poisoned	Product	True
  polio	Infectious Disease - Human	False
  poliovirus	Biological	True
  pollutant	Biological	True
  polychlorinated biphenyl	Chemical	False
  pond	Environmental	True
  pool	Environmental	True
  porcine epidemic diarrhea	Infectious Disease - Animal	False
  porcine epidemic diarrhea virus	Infectious Disease - Human	False
  porcine reproductive and respiratory syndrome	Infectious Disease - Animal	False
  porcine reproductive and respiratory syndrome virus	Biological	False
  pork	Product	True
  positive results	Infectious Disease - Animal	True
  positive results	Infectious Disease - Human	True
  positive results	Other Disease	True
  potassium cyanide	Chemical	False
  poultry	Product	True
  powassan encephalitis	Infectious Disease - Animal	False
  powassan encephalitis	Infectious Disease - Human	False
  powassan virus	Infectious Disease - Human	False
  power outage	Environmental	True
  power plant	Nuclear	True
  poxvirus	Biological	True
  poxvirus infection	Environmental	False
  prescription drugs	Product	True
  prevotella	Infectious Disease - Human	False
  prevotella infection	Environmental	False
  primaquine	Product	False
  primary amebic meningoencephalitis	Environmental	False
  prion	Biological	True
  prion disease	Environmental	False
  probable	Infectious Disease - Animal	True
  probable	Infectious Disease - Human	True
  probable	Other Disease	True
  processing	Chemical	True
  processing	Product	True
  production	Chemical	True
  production	Product	True
  products	Product	True
  progressive inflammatory neuropathy	Infectious Disease - Human	False
  progressive multifocal leukoencephalopathy	Environmental	False
  propane	Chemical	False
  protozoan	Biological	True
  pseudocowpox	Infectious Disease - Animal	False
  pseudocowpox virus	Infectious Disease - Human	False
  psilocin	Substance Abuse	False
  psilocybin	Substance Abuse	False
  psittacine	Product	False
  psittacosis	Infectious Disease - Animal	False
  psittacosis	Infectious Disease - Human	False
  purpura	Infectious Disease - Animal	True
  purpura	Other Disease	True
  puumala virus	Biological	False
  pyrethrin	Chemical	False
  pyrethroid	Chemical	False
  pyrethrum	Chemical	False
  pyrexia	Biological	True
  pyrimethamine	Chemical	False
  pyronaridine	Chemical	False
  q fever	Infectious Disease - Animal	False
  q fever	Infectious Disease - Human	False
  quarantined	Infectious Disease - Animal	True
  quarantined	Infectious Disease - Human	True
  quarantined	Other Disease	True
  rabbit haemorrhagic disease virus	Infectious Disease - Human	False
  rabbit hemorrhagic disease	Infectious Disease - Animal	False
  rabbits	Product	True
  rabies	Infectious Disease - Animal	False
  rabies	Infectious Disease - Human	False
  raccoon roundworm	Biological	False
  raccoon roundworm	Infectious Disease - Animal	False
  raccoon roundworm	Infectious Disease - Human	False
  radiation	Nuclear	True
  radioactive contaminants	Nuclear	True
  radioactive emission	Nuclear	True
  radioactive fall-out	Nuclear	True
  radioactive fuel	Nuclear	True
  radioactive material	Nuclear	True
  radioactive site	Nuclear	True
  radioactive toxins	Nuclear	True
  radioactive waste	Nuclear	True
  radioactivity	Nuclear	True
  radioisotopes	Nuclear	True
  radiologic	Nuclear	True
  radium	Nuclear	False
  rainfall	Environmental	False
  raki	Chemical	False
  ralstonia solanacearum	Biological	False
  rare strain	Biological	True
  rare strain	Infectious Disease - Animal	True
  rare strain	Infectious Disease - Human	True
  rare strain	Other Disease	True
  rat bite fever	Infectious Disease - Animal	False
  ratite	Product	False
  raw sewage	Environmental	True
  reactive arthritis	Other Disease	False
  recall	Chemical	True
  recall	Product	True
  red sea bream iridoviral disease	Infectious Disease - Animal	False
  red tide	Environmental	False
  red tide	Other Disease	False
  relapsing fever	Infectious Disease - Human	False
  relenza	Product	False
  repellant	Product	True
  repetitive strain injury	Other Disease	False
  respiratory syncytial virus	Infectious Disease - Human	False
  respiratory syncytial virus infection	Environmental	False
  retinopathy	Other Disease	False
  reye syndrome	Other Disease	False
  rhabdovirus carpio	Infectious Disease - Human	False
  rheumatic fever	Other Disease	False
  rhinosporidiosis	Environmental	False
  rhinosporidium seeberi	Infectious Disease - Human	False
  rhinotracheitis	Infectious Disease - Animal	False
  rhinovirus	Infectious Disease - Human	False
  rhinovirus infection	Environmental	False
  ricin	Chemical	False
  rickettsia akari	Infectious Disease - Human	False
  rickettsia conorii	Infectious Disease - Human	False
  rickettsia rickettsii	Biological	False
  rickettsial infection	Environmental	False
  rickettsialpox	Environmental	False
  rift valley fever	Infectious Disease - Animal	False
  rift valley fever	Infectious Disease - Human	False
  rift valley fever virus	Infectious Disease - Human	False
  rimantadine	Product	False
  rinderpest	Infectious Disease - Animal	False
  rinderpest virus	Infectious Disease - Human	False
  ring rot	Other Disease	False
  ringworm	Infectious Disease - Animal	False
  ringworm	Infectious Disease - Human	False
  risks	Biological	True
  river blindness	Environmental	False
  river blindness	Infectious Disease - Animal	False
  river blindness	Infectious Disease - Human	False
  rochalimaea	Infectious Disease - Human	False
  rocio virus	Biological	False
  rocio virus encephalitis	Infectious Disease - Animal	False
  rocio virus encephalitis	Infectious Disease - Human	False
  rocky mountain spotted fever	Infectious Disease - Animal	False
  rocky mountain spotted fever	Infectious Disease - Human	False
  roseolovirus	Infectious Disease - Human	False
  ross river fever	Infectious Disease - Animal	False
  ross river fever	Infectious Disease - Human	False
  ross river virus	Biological	False
  rotaviral diarrhea	Other Disease	False
  rotavirus	Biological	True
  rotavirus infection	Environmental	False
  round small structured virus	Biological	True
  roundworm	Infectious Disease - Animal	False
  roundworm	Infectious Disease - Human	False
  ru 486	Product	False
  rubella	Infectious Disease - Human	False
  rubella virus	Infectious Disease - Human	False
  ruminants	Product	True
  russian spring summer encephalitis	Infectious Disease - Animal	False
  russian spring summer encephalitis	Infectious Disease - Human	False
  russian spring-summer encephalitis virus	Infectious Disease - Human	False
  saaremaa virus	Infectious Disease - Human	False
  sabia virus	Biological	False
  safet*	Biological	True
  safet*	Chemical	True
  safet*	Environmental	True
  safet*	Nuclear	True
  safet*	Product	True
  salmon	Product	True
  salmonella	Biological	False
  salmonella enterica	Infectious Disease - Human	False
  salmonella typhi	Infectious Disease - Human	False
  salmonellosis	Infectious Disease - Animal	False
  salmonellosis	Infectious Disease - Human	False
  salvia divinorum	Substance Abuse	False
  sandstorm	Biological	False
  sarcocystosis	Infectious Disease - Animal	False
  sarcoptes scabeii infection	Infectious Disease - Animal	False
  sarcoptes scabiei	Infectious Disease - Human	False
  sarin	Chemical	False
  saxitoxin	Biological	False
  scabies	Infectious Disease - Human	False
  scarlet fever	Infectious Disease - Human	False
  schistosoma	Infectious Disease - Human	False
  schistosomiasis	Infectious Disease - Animal	False
  schistosomiasis	Infectious Disease - Human	False
  sclerophthora rayssiae	Biological	False
  scrapie	Infectious Disease - Animal	False
  screwworm	Biological	False
  screwworm	Infectious Disease - Animal	False
  screwworm infestation	Other Disease	False
  seafoods	Product	False
  sedative*	Substance Abuse	True
  sedatives	Product	False
  sedatives	Substance Abuse	False
  seeds	Product	False
  seism*	Biological	False
  semliki forest virus	Biological	False
  seoul virus	Infectious Disease - Human	False
  serum	Biological	True
  serum	Product	True
  sesqui mustard	Chemical	False
  severe acute respiratory syndrome	Infectious Disease - Animal	False
  severe acute respiratory syndrome	Infectious Disease - Human	False
  sexually transmitted disease	Infectious Disease - Human	False
  shellfish	Product	False
  shiga toxin	Biological	False
  shigella	Biological	False
  shigellosis	Infectious Disease - Animal	False
  shigellosis	Infectious Disease - Human	False
  shingles	Environmental	False
  shortage	Chemical	True
  shortage	Nuclear	True
  shortage	Product	True
  sick building syndrome	Other Disease	False
  sleep apnea	Other Disease	False
  slow virus	Biological	True
  slowed breathing	Substance Abuse	True
  small virus-like particle	Infectious Disease - Human	False
  smallpox	Infectious Disease - Human	False
  smallpox virus	Infectious Disease - Human	False
  smart bomb	Nuclear	True
  smog	Biological	False
  smuggle	Biological	True
  smuggle	Chemical	True
  smuggle	Nuclear	True
  smuggle	Product	True
  smuggling	Biological	True
  smuggling	Chemical	True
  smuggling	Nuclear	True
  smuggling	Product	True
  snowstorm	Environmental	False
  sodium azide	Chemical	False
  sodium cyanide	Chemical	False
  sodium monofluoroacetate	Chemical	False
  soman	Chemical	False
  sore mouth	Infectious Disease - Animal	False
  soybean rust	Other Disease	False
  soybean rust	Product	False
  spirillum	Infectious Disease - Human	False
  spirillum minus	Infectious Disease - Human	False
  spondweni	None	False
  sporothrix	Infectious Disease - Human	False
  sporothrix schenckii	Infectious Disease - Human	False
  sporotrichosis	Environmental	False
  sporotrichosis	Infectious Disease - Animal	False
  spread	Infectious Disease - Animal	True
  spread	Infectious Disease - Human	True
  spread	Other Disease	True
  spring viremia of carp	Infectious Disease - Animal	False
  st. louis encephalitis	Infectious Disease - Animal	False
  st. louis encephalitis	Infectious Disease - Human	False
  staphylococcal enterotoxin b	Infectious Disease - Animal	False
  staphylococcal food poisoning	Environmental	False
  staphylococcal infection	Environmental	False
  staphylococcus	Infectious Disease - Human	False
  staphylococcus aureus	Biological	False
  steaks	Product	False
  stem cell	Biological	True
  steroid*	Substance Abuse	False
  stibine	Chemical	False
  stimulant*	Substance Abuse	True
  stockpile	Chemical	True
  stockpile	Nuclear	True
  stockpile	Product	True
  stolen	Biological	True
  stolen	Chemical	True
  stolen	Nuclear	True
  stolen	Product	True
  stomatitis	Infectious Disease - Animal	False
  storage	Chemical	True
  storage	Nuclear	True
  storage	Product	True
  storm	Environmental	False
  street drugs	Substance Abuse	False
  streptococcus	Biological	True
  streptococcus agalactiae	Infectious Disease - Human	False
  streptococcus pneumoniae	Biological	False
  streptococcus suis disease	Infectious Disease - Animal	False
  streptococcus suis disease	Infectious Disease - Human	False
  stroke	Other Disease	False
  strongyloidiasis	Infectious Disease - Animal	False
  strongyloidiasis	Infectious Disease - Human	False
  strontium	Nuclear	False
  strychnine	Chemical	False
  study	Biological	True
  subacute sclerosing panencephalitis	Environmental	False
  sudden infant death	Other Disease	False
  suidae	Product	False
  sulfadoxine	Biological	True
  sulfadoxine	Chemical	True
  sulfur mustard	Chemical	False
  sulfuryl fluoride	Chemical	False
  sulphuric acid	Chemical	False
  super warfarin	Chemical	False
  superbug	Biological	True
  surra	Infectious Disease - Animal	False
  suspected case	Infectious Disease - Animal	True
  suspected case	Infectious Disease - Human	True
  suspected case	Other Disease	True
  suspicious package	Biological	True
  suspicious package	Chemical	True
  suspicious package	Nuclear	True
  swimmer's itch	Other Disease	False
  swine influenza	Infectious Disease - Animal	False
  swine influenza virus	Infectious Disease - Human	False
  swine vesicular disease	Infectious Disease - Animal	False
  symptoms	Infectious Disease - Animal	True
  symptoms	Infectious Disease - Human	True
  symptoms	Other Disease	True
  synthetic cannabinoid	Substance Abuse	False
  syphilis	Infectious Disease - Human	False
  tabun	Chemical	False
  tacaribe virus	Biological	False
  taenia	Biological	True
  taenia	Infectious Disease - Human	True
  taenia solium	Infectious Disease - Human	False
  taeniasis	Infectious Disease - Animal	False
  taeniasis	Infectious Disease - Human	False
  tamiflu	Product	False
  tampered	Chemical	True
  tampered	Nuclear	True
  tampered	Product	True
  tan spot	Other Disease	False
  taura syndrome	Infectious Disease - Animal	False
  teratogen	Product	False
  terrorism	Biological	True
  terrorism	Chemical	True
  terrorism	Nuclear	True
  terrorism	Product	True
  teschovirus	Infectious Disease - Human	False
  test	Biological	True
  test	Infectious Disease - Animal	True
  test	Infectious Disease - Human	True
  test	Nuclear	True
  tetanus	Other Disease	False
  tetrodotoxin	Biological	True
  thallium	Chemical	False
  theileria equi	Infectious Disease - Human	False
  theileria parva	Infectious Disease - Human	False
  theileriosis	Infectious Disease - Animal	False
  therapeutic products	Product	False
  therapy	Nuclear	True
  thorium	Nuclear	False
  thunderstorm	Environmental	False
  tick	Biological	True
  tidal wave	Environmental	True
  tonate virus	Biological	False
  tornado	Environmental	False
  toxic	Chemical	True
  toxic	Nuclear	True
  toxic	Product	True
  toxic chemical	Chemical	True
  toxic materials	Product	True
  toxic release	Chemical	True
  toxic shock	Other Disease	True
  toxic waste	Biological	False
  toxoplasma	Infectious Disease - Human	False
  toxoplasmosis	Infectious Disease - Animal	False
  toxoplasmosis	Infectious Disease - Human	False
  trachoma	Infectious Disease - Human	False
  transmissible gastroenteritis	Infectious Disease - Animal	False
  transmissible gastroenteritis coronavirus	Infectious Disease - Human	False
  transmissible mink encephalopathy	Infectious Disease - Animal	False
  transplants	Biological	True
  transportation	Chemical	True
  transportation	Product	True
  trench fever	Infectious Disease - Animal	False
  trench fever	Infectious Disease - Human	False
  treponema	Infectious Disease - Human	False
  trichinellosis	Infectious Disease - Animal	False
  trichinellosis	Infectious Disease - Human	False
  trichomonas	Infectious Disease - Human	False
  trichomoniasis	Environmental	False
  trichomonosis	Infectious Disease - Animal	False
  trichothecene	Biological	True
  trichuriasis	Infectious Disease - Animal	False
  trichuriasis	Infectious Disease - Human	False
  trichuris	Infectious Disease - Human	False
  trypanosoma cruzi	Biological	False
  trypanosoma equiperdum	Infectious Disease - Human	False
  trypanosoma evansi	Infectious Disease - Human	False
  trypanosomiasis	Infectious Disease - Animal	False
  trypanosomiasis	Infectious Disease - Human	False
  tsunami	Environmental	False
  tsutsugamushi fever	Infectious Disease - Animal	False
  tsutsugamushi fever	Infectious Disease - Human	False
  tuberculosis	Infectious Disease - Animal	False
  tuberculosis	Infectious Disease - Human	False
  tularemia	Infectious Disease - Animal	False
  tularemia	Infectious Disease - Human	False
  tumor	Biological	True
  tumor	Other Disease	True
  turkey	Product	False
  turkey rhinotracheitis	Infectious Disease - Animal	False
  turkey rhinotracheitis virus	Infectious Disease - Human	False
  typhoid fever	Infectious Disease - Human	False
  typhoon	Environmental	False
  typhus fever	Infectious Disease - Animal	False
  typhus fever	Infectious Disease - Human	False
  uncinaria stenocephala	Infectious Disease - Human	False
  uncinaria stenocephala infection	Environmental	False
  uncinaria stenocephala infection	Infectious Disease - Animal	False
  unconscious*	Substance Abuse	True
  ungulate	Product	False
  unknown	Biological	True
  unknown	Chemical	True
  unknown	Infectious Disease - Animal	True
  unknown	Infectious Disease - Human	True
  unknown	Nuclear	True
  unknown	Other Disease	True
  unknown	Product	True
  unknown chemical	Chemical	True
  unknown substance	Biological	True
  unknown substance	Chemical	True
  unknown substance	Nuclear	True
  uranium	Nuclear	False
  urea formaldehyde	Chemical	False
  ureaplasma	Infectious Disease - Human	False
  ureaplasma urealyticum infection	Environmental	False
  uruma fever	Infectious Disease - Animal	False
  uruma fever	Infectious Disease - Human	False
  uv	Nuclear	False
  vaccines	Biological	True
  vaccines	Product	True
  vancomycin	Chemical	False
  vancomycin-resistant enterococci	Biological	False
  vaping	Substance Abuse	False
  variant creutzfeldt-jacob disease	Infectious Disease - Human	False
  varicella virus	Biological	False
  vegetables	Product	True
  venezuelan equine encephalitis	Infectious Disease - Animal	False
  venezuelan equine encephalitis	Infectious Disease - Human	False
  venezuelan hemorrhagic fever	Infectious Disease - Animal	False
  venezuelan hemorrhagic fever	Infectious Disease - Human	False
  vesicant	Chemical	False
  vesicular stomatitis	Infectious Disease - Animal	False
  vesicular stomatitis virus	Infectious Disease - Human	False
  vibrio	Biological	True
  vibrio cholerae	Biological	False
  viral gastroenteritis	Environmental	False
  viral gastroenteritis	Infectious Disease - Human	False
  viral haemorrhagic septicaemia	Infectious Disease - Animal	False
  viral hemorrhagic septicemia virus	Infectious Disease - Human	False
  virino	Biological	False
  virus	Biological	True
  vitamin	Product	False
  volcano	Environmental	False
  vx	Chemical	False
  warfare	Chemical	True
  warfare	Nuclear	True
  warning system	Environmental	True
  waste	Chemical	True
  waste	Nuclear	True
  wastewater	Environmental	True
  water	Chemical	True
  water	Environmental	True
  wesselsbron disease	Infectious Disease - Animal	False
  wesselsbron virus	Infectious Disease - Human	False
  west nile encephalitis	Infectious Disease - Human	False
  west nile fever	Infectious Disease - Animal	False
  west nile fever	Infectious Disease - Human	False
  west nile virus	Biological	False
  western equine encephalitis	Infectious Disease - Animal	False
  western equine encephalitis	Infectious Disease - Human	False
  western equine encephalomyelitis	Infectious Disease - Animal	False
  wheat streak virus	Other Disease	False
  white phosphorus	Chemical	False
  white spot disease	Infectious Disease - Animal	False
  white tail disease	Infectious Disease - Animal	False
  wild birds	Infectious Disease - Animal	True
  wild birds	Product	True
  wildfire	Biological	False
  wildfire	Environmental	False
  wildlife	Infectious Disease - Animal	True
  wildlife	Product	True
  world health organization	Product	True
  wuchereria bancrofti	Infectious Disease - Human	False
  x-ray	Nuclear	False
  xanthium strumarium	Biological	False
  xanthomonas oryzae	Biological	False
  xenotransplantation	Biological	True
  xylella fastidiosa	Other Disease	False
  yaks	Product	False
  yaws	Infectious Disease - Animal	False
  yaws	Infectious Disease - Human	False
  yellow fever	Infectious Disease - Animal	False
  yellow fever	Infectious Disease - Human	False
  yersinia enterocolitica	Biological	False
  yersinia pestis	Biological	False
  yersiniosis	Infectious Disease - Animal	False
  yersiniosis	Infectious Disease - Human	False
  zanamivir	Product	False
  zebra mussel	Environmental	False
  zika fever	Environmental	False
  zika fever	Infectious Disease - Human	False
  zika virus	Infectious Disease - Human	False
  zoonotic ancylostomiasis	Infectious Disease - Animal	False
  zoonotic ancylostomiasis	Infectious Disease - Human	False
  zygomycosis	Environmental	False
  zygomycota phylum	Infectious Disease - Human	False
`);
};

export default s;
