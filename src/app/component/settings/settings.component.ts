import {Component, OnInit} from '@angular/core';
import {
  AdminService,
  LeaveTypeCreateApiModel,
  SettingApiModel,
  SettingService, SettingUpdateApiModel,
  UserApiModel,
  UserService
} from "../../api";
import {Router} from "@angular/router";
import {MatDialog, MatTableDataSource} from "@angular/material";
import {DeleteUserDialogComponent} from "../user-profile/delete-user-dialog/delete-user-dialog.component";
import {SettingDialogComponent} from "./setting-dialog/setting-dialog.component";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private settingService: SettingService, private adminService: AdminService, private router: Router, private dialog: MatDialog) {
    this.getAllSettings();
  }

  public settings: Array<SettingApiModel> = [];
  public displayedColumns: string[] = ['key', 'description', 'value', 'min', 'max'];
  public dataSource: MatTableDataSource<SettingApiModel>;

  ngOnInit() {

  }

  getAllSettings() {
    this.settingService.getAllSettings().subscribe((settings: SettingApiModel[]) => {
      this.settings = settings;
      this.fillData();
    });
  }

  fillData() {
    this.dataSource = new MatTableDataSource<SettingApiModel>(this.settings);
  }

  reloadData(){
    this.settings = null;
    this.dataSource = null;
    this.getAllSettings();
  }

  editSettingDialog(setting) {
    let dialogRef = this.dialog.open(SettingDialogComponent, {data: {setting: setting}});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'false' || result === undefined) {
      } else {
        this.editSetting(result, setting.key);
      }
    });
  }

  editSetting(updatedValue, settingKey) {
    const settingValue: SettingUpdateApiModel = {
      value: updatedValue
    };

    this.adminService.updateSetting(settingValue, settingKey).subscribe(
      response => {
        this.reloadData();
      });
  }

}
