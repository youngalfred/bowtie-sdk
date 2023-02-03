import { Component, Input, OnInit } from "@angular/core";
import { info } from "../decorators/information";
import { icons } from "../decorators/question-images/icons";

@Component({
    selector: "info-hover",
    templateUrl: "./info-hover.component.html",
    styleUrls: ["./info-hover.component.css"],
})
export class InfoHoverComponent implements OnInit {
    public hoverableInfo: string = "";
    public showInfo = false;
    public infoIcon = icons.info;

    constructor() {}

    @Input("fieldname") id: string = "";

    ngOnInit() {
        this.hoverableInfo = info[this.id] || "";
    }
}
