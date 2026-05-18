import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  faSolidBriefcase,
  faSolidDiagramProject,
  faSolidFileLines,
} from '@ng-icons/font-awesome/solid';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ROUTE_DEFINITION } from '../../constants/route-definition';

@Component({
  selector: 'app-workspace-page',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIcon],
  templateUrl: './workspace-page.html',
  styleUrl: './workspace-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideIcons({
      faSolidBriefcase,
      faSolidDiagramProject,
      faSolidFileLines,
    }),
  ],
})
export class WorkspacePage {
  protected readonly navItems = [
    {
      label: 'Prompts',
      path: ['/', ROUTE_DEFINITION.APP.WORKSPACE, ROUTE_DEFINITION.WORKSPACE.PROMPT],
      icon: 'faSolidFileLines',
    },
    {
      label: 'Workflows',
      path: ['/', ROUTE_DEFINITION.APP.WORKSPACE, ROUTE_DEFINITION.WORKSPACE.WORKFLOW],
      icon: 'faSolidDiagramProject',
    },
    {
      label: 'Jobs',
      path: ['/', ROUTE_DEFINITION.APP.WORKSPACE, ROUTE_DEFINITION.WORKSPACE.JOB],
      icon: 'faSolidBriefcase',
    },
  ] as const;
}
