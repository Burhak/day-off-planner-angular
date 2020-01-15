import { Component, OnInit } from '@angular/core';
import { AdminService, SettingApiModel, SettingService, SettingUpdateApiModel } from '../../api';
import { MatDialog, MatTableDataSource } from '@angular/material';
import { SettingDialogComponent } from './setting-dialog/setting-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(private settingService: SettingService, private adminService: AdminService, private dialog: MatDialog) {
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

  reloadData() {
    this.settings = null;
    this.dataSource = null;
    this.getAllSettings();
  }

  editSettingDialog(setting: SettingApiModel) {
    const dialogRef = this.dialog.open(SettingDialogComponent, {data: { setting }});
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result === 'false' || result === undefined) {
      } else {
        this.editSetting(result, setting.key);
      }
    });
  }

  editSetting(updatedValue: number, settingKey: string) {
    const settingValue: SettingUpdateApiModel = {
      value: updatedValue
    };

    this.adminService.updateSetting(settingValue, settingKey).subscribe(
      response => {
        this.reloadData();
      });
  }

}
