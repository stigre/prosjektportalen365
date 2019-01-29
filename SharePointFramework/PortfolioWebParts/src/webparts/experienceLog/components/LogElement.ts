export default class LogElement {
  public Path: string;
  public Title: string;
  public SiteTitle: string;
  public SPWebUrl: string;
  public Description: string;
  public Responsible: string;
  public Consequence: string;
  public Recommendation: string;
  public Actors: string;

  constructor(data) {
      this.Path = data.Path;
      this.Title = data.Title;
      this.SiteTitle = data.SiteTitle;
      this.SPWebUrl = data.SPWebUrl;
      this.Description = data.GtProjectLogType;
      this.Responsible = data.GtProjectLogResponsible;
      this.Consequence = data.GtProjectLogConsequence;
      this.Recommendation = data.GtProjectLogRecommendation;
      this.Actors = data.GtProjectLogActors ? data.GtProjectLogActors.split(";#").join(", ") : "";
  }
}
